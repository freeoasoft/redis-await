
/*
Redia通过检查服务器发回数据的第一个字节， 可以确定这个回复是什么类型：

参考: http://doc.redisfans.com/topic/protocol.html

状态回复(status reply)的第一个字节是 "+"
错误回复(error reply)的第一个字节是 "-"
整数回复(integer reply)的第一个字节是 ":"
批量回复(bulk reply)的第一个字节是 "$"
多条批量回复(multi bulk reply)的第一个字节是 "*"
*/



//实际测试直接写for循环比调用原生方法process.binding('buffer').indexOfNumber更快
function indexOf(buffer, index) {

    let length = buffer.length;

    while (index < length)
    {
        if (buffer[index] === 13 && buffer[index + 1] === 10)
        {
            return index;
        }

        index++;
    }

    return -1;
};


//开始接收数据
function receive_data(queue, buffer) {

    let index = 0;
    let length = buffer.length;

    while (index < length)
    {
        //如果无等待则丢弃数据
        if (!queue[0])
        {
            return;
        }

        let next = indexOf(buffer, index);

        if (next < 0)
        {
            return {
                
                buffer: index > 0 ? buffer.slice(index) : buffer
            };
        }

        let any = buffer.utf8Slice(index + 1, next);

        switch (buffer[index++])
        {
            case 43: //+
                index = next + 2;
                queue.shift()[0](any);
                break;

            case 45: //-
                index = next + 2;
                queue.shift()[1](any);
                break;

            case 58: //:
                index = next + 2;
                queue.shift()[0](+any);
                break;

            case 36: //$
                if ((any |= 0) <= 0)
                {
                    index = next + 2;
                    queue.shift()[0](any < 0 ? null : '');

                    //注:有时会发送两个\r\n\r\n
                    if (buffer[index] === 13 && buffer[index + 1] === 10)
                    {
                        index += 2;
                    }
                }
                else if (length - next - 2 >= any) //字节足够
                {
                    index = next + 2;
                    queue.shift()[0](buffer.utf8Slice(index, index += any));
                    index += 2;
                }
                else //字节不够则暂停解析
                {
                    index--;

                    return {
                        
                        buffer: index > 0 ? buffer.slice(index) : buffer
                    };
                }
                break;

            case 42: //* 
                index = next + 2;

                if ((any |= 0) <= 0)
                {
                    queue.shift()[0](any < 0 ? null : []);

                    //注:有时会发送两个\r\n\r\n
                    if (buffer[index] === 13 && buffer[index + 1] === 10)
                    {
                        index += 2;
                    }
                }
                else
                {
                    let array = [];

                    array.total = any;
                    any = receive_array(array, buffer, index);

                    if (any > 0)
                    {
                        queue.shift()[0](array);
                    }
                    else
                    {
                        any = array.buffer;
                        array.buffer = null;

                        return { array: array, buffer: buffer }; //暂停解析
                    }
                }
                break;

            default:
                throw 'redis response data error!';
                break;
        }
    }
};


//接收bulk数据
function receive_array(array, buffer, index) {

    let length = buffer.length;
    let total = array.total;

    do
    {
        let next = indexOf(buffer, index);

        if (next < 0)
        {
            array.buffer = index > 0 ? buffer.slice(index) : buffer;
            return -1;
        }

        let any = buffer.utf8Slice(index + 1, next);

        switch (buffer[index++])
        {
            case 43: //+
                index = next + 2;
                array.push(any);
                break;

            case 58: //:
                index = next + 2;
                array.push(any | 0);
                break;

            case 36: //$
                if ((any |= 0) <= 0)
                {
                    index = next + 2;
                    array.push(any < 0 ? null : '');

                    //注:有时会发送两个\r\n\r\n
                    if (buffer[index] === 13 && buffer[index + 1] === 10)
                    {
                        index += 2;
                    }
                }
                else if (length - next - 2 >= any) //字节足够
                {
                    index = next + 2;
                    array.push(buffer.utf8Slice(index, index += any));
                    index += 2;
                }
                else //字节不够则暂停解析
                {
                    index--;
                    array.buffer = index > 0 ? buffer.slice(index) : buffer
                    return -1;
                }
                break;

            default:
                throw 'redis response data error!';
                break;
        }
            
        if (!--total)
        {
            return index;
        }
    }
    while (index < length);
};


//从上次暂停的位置继续接收数据
function receive_resume(waiting, queue, buffer) {

    let any = waiting.array;

    buffer = waiting.buffer = Buffer.concat([waiting.buffer, buffer]);

    //上次暂停的是数组
    if (any)
    {
        any = receive_array(array, buffer, 0);

        if (any > 0)
        {
            waiting.shift()[0](array);
        }
        else
        {
            return waiting;
        }
    }
    else
    {
        return receive_data(queue, buffer);
    }
};


//socket data事件处理
function onreceive(buffer) {

    let queue = this.queue;
    let waiting = this.__waiting;

    try
    {
        if (waiting)
        {
            //无等待请求则丢弃数据
            waiting = waiting[0] && receive_resume(waiting, query, buffer);
        }
        else
        {
            waiting = receive_data(queue, buffer, 0);
        }

        this.__waiting = waiting;
    }
    catch (e) //解析出错清除全部等待
    {
        this.__waiting = null;

        while (waiting = queue.shift())
        {
            waiting[1](e);
        }
    }
};


module.exports = function (socket) {

    //消息队列
    this.queue = [];

    //是否可用
    this.enabled = true;

    this.socket = socket;

    socket.on('data', onreceive.bind(this));
};

