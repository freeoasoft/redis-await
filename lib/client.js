const net = require('net');

//直接绑定计算utf8字符串字节的原生方法
const utf8length = process.binding('buffer').byteLengthUtf8;

const receiver = require('./receiver');


const connected = Symbol();



//重新连接socket
function reconnect() {

    let socket = this.socket;
    let delay = this.delay | 0;

    this.enabled = false;

    if (delay < 10)
    {
        delay = this.delay = 10;
    }
    else if (delay < 60000)
    {
        this.delay <<= 1;
    }

    setTimeout(() => {

        socket.connect(this.port, this.host);

    }, delay);
};




module.exports = class RedisClient {


    constructor(options) {

        let socket = this.socket = new net.Socket();
        let commands = this.commands = []; //指令队列
        let [receive, clear] = receiver(commands);

        //是否可用
        this.enabled = false;

        options = options || {};

        this.host = options.host || '127.0.0.1';
        this.port = options.port || 6379;

        socket.on('connect', () => {

            this.enabled = true;
            this.delay = 10;

            console.log('Redis connection to', this.host, this.port);
        });

        socket.on('data', receive);

        socket.on('error', e => {
            
            if (this[connected])
            {
                //清空接收器
                clear();
                reconnect.call(this)
            }
            else
            {
                console.error(e);
            }
        });
    };


    /**
     * connect to redis server
     */
    async connect() {

        return new Promise((resolve, reject) => {

            this.socket.connect(this.port, this.host, () => {

                this[connected] = true;
                resolve(this);
            });
        });
    };


    
    /**
     * execute redis command
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

            //注: 发送不了$-1\r\n格式的数据
            if (value == null)
            {
                throw 'value sent to redis can not be null!';
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

        let promise = new Promise((...args) => {

            this.commands.push(args);
        });

        this.socket.write(list.join('\r\n'), 'utf8');

        return promise;
    };


    /**
     * direct send redis format text
     * @param {*} text 
     */
    send(text) {

        let promise = new Promise((...args) => {

            this.commands.push(args);
        });

        this.socket.write(text, 'utf8');

        return promise;
    };


};