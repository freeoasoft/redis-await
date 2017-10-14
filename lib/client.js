const net = require('net');

const Receiver = require('./receiver.js');

//直接绑定计算utf8字符串字节的原生方法
const utf8length = process.binding('buffer').byteLengthUtf8;



//创建socket
function createSocket(client, host, port, length) {

    let pool = client.pool;
    let socket = new net.Socket();

    socket.disabled = false;

    socket.__host = host;
    socket.__port = port;
    socket.__delay = 10; //默认10ms后重连

    socket.connect(port, host, () => {

        let receiver = new Receiver(socket);

        socket.on('timeout', reconnect.bind(receiver));
        socket.on('close', reconnect.bind(receiver));

        pool.push(receiver);

        console.log('Redis connection to', host, port);

        if (--length > 0)
        {
            createSocket(client, host, port, length);
        }
        else
        {
            client.__ready();
        }
    });

    return socket;
};


//重新连接socket
function reconnect() {

    let socket = this.socket;
    let delay = socket.__delay | 0;

    this.enabled = false;

    if (delay < 10)
    {
        delay = socket.__delay = 10;
    }
    else if (delay < 60000)
    {
        socket.__delay <<= 1;
    }

    setTimeout(() => {

        socket.connect(socket.__port, socket.__host, () => {

            this.enabled = true;
            socket.__delay = 10;
        });

    }, delay);
};



module.exports = class RedisClient {


    constructor(options) {

        options = options || {};
        
        this.pool = [];
        this.host = options.host || '127.0.0.1';
        this.port = options.port || 6379;

        this.__ready_list = [];

        createSocket(this, this.host, this.port, options.pool || 2);
    };


    /**
     * 执行redis命令
     * @param {*} key 
     * @param {*} args 
     */
    command(key, ...args) {

        let fn = utf8length;
        let length = args.length;
        let list = ['*' + (length + 1), '$' + fn(key), key];

        for (let i = 0; i < length; i++)
        {
            let value = args[i];

            if (value === null)
            {
                list.push('$-1');
            }
            else
            {
                //注: 发送命令不支持":"整数格式
                switch (typeof value)
                {
                    case 'boolean':
                        list.push('$1', value ? 1 : 0);
                        break;

                    case 'number':
                        value = '' + value; //小数按字符串处理
                        list.push('$' + fn(value), value);
                        break;

                    case 'string':
                        list.push('$' + (value ? fn(value) : 0), value);
                        break;

                    default: //序列化对象
                        value = JSON.stringify(value);
                        list.push('$' + fn(value), value);
                        break;
                }
            }
        }

        list.push('');

        return this.send(list.join('\r\n'));
    };


    /**
     * 直接发送redis格式的指令
     * @param {*} text 
     */
    send(text) {

        let pool = this.pool;
        let receiver = pool[0];
        let index = 0;
        let item, any;

        any = 10000;
        
        //找到等待请求数最少的receiver
        while (item = pool[index++])
        {
            if (item.enabled && item.queue.length < any)
            {
                receiver = item;
            }
        }

        if (!receiver)
        {
            return new Promise((resolve, reject) => {

                reject('Redis client does not start!');
            });
        }

        any = new Promise((...args) => {

            receiver.queue.push(args);
        });

        receiver.socket.write(text, 'utf8');

        return any;
    };


    /**
     * 等待redis准备完毕
     * @param {*} fn 
     */
    async ready() {

        return new Promise(resolve => {

            let ready = this.__ready_list;

            if (ready)
            {
                ready.push(resolve);
            }
            else
            {
                resolve(this);
            }
        });
    };


    __ready() {

        let list = this.__ready_list;

        this.__ready_list = null;

        for (let i = 0, l = list.length; i < l; i++)
        {
            list[i](this);
        }
    };


};