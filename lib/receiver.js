
/*
Redis通过检查服务器发回数据的第一个字节， 可以确定这个回复是什么类型：

参考: http://doc.redisfans.com/topic/protocol.html

状态回复(status reply)的第一个字节是 "+"
错误回复(error reply)的第一个字节是 "-"
整数回复(integer reply)的第一个字节是 ":"
批量回复(bulk reply)的第一个字节是 "$"
多条批量回复(multi bulk reply)的第一个字节是 "*"
*/


module.exports = function (commands) {


    //等待解析的buffer缓存
    let cache = [];
    
    //挂起时的位置
    let position = 0;

    //已解析的bulk结果
    let bulk = [];

    //需要等待的字节数
    let wait = 0;

    //收到的字节数
    let receive = 0;

    //是否已挂起
    let suspend = 0;


    //抛出解析错误
    let raiseError = () => {

        let text = 'redis format parsing error!';
        let list = commands;

        for (let i = 0, l = list.length; i < l; i++)
        {
            list[i][1](text);
        }

        commands.length = cache.length = wait = receive = suspend = 0;
        bulk = [];

        return false;
    };


    //获取批量文本
    let batchText = (list, buffer, line, total, bytes) => {

        if (bytes > total)
        {
            let length = buffer.length;
            let index = length - bytes + total;

            if (buffer[index] === 13 && buffer[index + 1] === 10)
            {
                index += 2;
            }

            if (index >= length)
            {
                position = 0;
                buffer = Buffer.concat(list.splice(0), total);
            }
            else
            {
                position = index;
                        
                bytes = list.slice(0, line + 1);
                list.splice(0, line);

                buffer = Buffer.concat(bytes, total);
            }
    
            return buffer.utf8Slice(0);
        }

        position = 0;
        return Buffer.concat(list.splice(0), total).utf8Slice(0);
    };


    //读取"+-:"后面的内容(估计不会有太长的内容)
    let readCRLF = (list, buffer, index) => {

        let bytes, any;

        //如果有多行记录先合并
        if (list.length > 1)
        {
            list[0] = buffer = Buffer.concat(list);
            list.length = 1;
        }

        bytes = buffer.length;

        for (let i = index; i < bytes; i++)
        {
            if (buffer[i] === 13 && buffer[i + 1] === 10)
            {
                any = i + 2;

                //读完则退出
                if (any >= bytes)
                {
                    position = 0;
                    list.length = 0;
                }
                else
                {
                    position = any;
                }

                return buffer.utf8Slice(index, i);
            }
        }

        suspend = true;
        return false;
    };


    //读取批量回复
    let readBatch = (list, total) => {

        let buffer = list[0];

        if (buffer)
        {
            let bytes = buffer.length;
            let index = position;
            let any;

            if (bytes - index >= total)
            {
                any = total = index + total;

                if (buffer[any] === 13 && buffer[any + 1] === 10)
                {
                    any += 2;
                }

                if (any >= bytes)
                {
                    position = 0;
                    list.shift();
                }
                else
                {
                    position = any;
                }

                return buffer.utf8Slice(index, total);
            }

            bytes = (list[0] = buffer.slice(position)).length;
            index = 1;

            while (buffer = list[index])
            {
                bytes += buffer.length;
    
                //如果字节足够则返回
                if (bytes > total)
                {
                    return batchText(list, buffer, index, total, bytes);
                }

                index++;
            }

            receive = bytes;
        }
        else
        {
            receive = 0;
        }

        wait = total;
        suspend = true;
        return false;
    };


    //读取多条批量回复
    let readBulk = (list, count) => {

        let array = bulk;
        let buffer;
        let any;

        while (buffer = list[0])
        {
            any = position;

            switch (buffer[any])
            {
                case 43: //+
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        array.count = count;
                        return false;
                    }

                    array.push(any);

                    if (!--count)
                    {
                        commands.shift()[0](array);
                        bulk = [];
                        return;
                    }
                    break;

                case 58: //:
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        array.count = count;
                        return false;
                    }

                    array.push(+any);

                    if (!--count)
                    {
                        commands.shift()[0](array);
                        bulk = [];
                        return;
                    }
                    break;

                case 36: //$
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        return false;
                    }

                    if ((any |= 0) <= 0)
                    {
                        any = any < 0 ? null : '';
                    }
                    else if ((any = readBatch(list, any | 0)) === false)
                    {
                        array.count = count;
                        return false;
                    }

                    array.push(any);

                    if (!--count)
                    {
                        commands.shift()[0](array);
                        bulk = [];
                        return;
                    }
                    break;

                case 13: //如果有多余的1310则丢弃
                    any = ++position;

                    if (buffer[any] === 10)
                    {
                        any++;
                    }

                    if (any >= buffer.length)
                    {
                        position = 0;
                        list.shift();
                    }
                    else
                    {
                        position = any;
                    }
                    break;

                case 10:
                    if (++position >= buffer.length)
                    {
                        position = 0;
                        list.shift();
                    }
                    break;

                case void 0:
                    list.shift();
                    break;

                default:
                    return raiseError();
            }
        }
    };


    //解析
    let parse = list => {

        let any;

        while (buffer = list[0])
        {
            any = position;

            switch (buffer[any])
            {
                case 43: //+
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        return false;
                    }

                    commands.shift()[0](any);
                    break;

                case 45: //-
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        return false;
                    }

                    commands.shift()[1](any);
                    break;

                case 58: //:
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        return false;
                    }

                    commands.shift()[0](+any);
                    break;

                case 36: //$
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        return false;
                    }

                    if ((any |= 0) <= 0)
                    {
                        any = any < 0 ? null : '';
                    }
                    else if ((any = readBatch(list, any)) === false)
                    {
                        return false;
                    }

                    commands.shift()[0](any);
                    break;

                case 42: //*
                    if ((any = readCRLF(list, buffer, any + 1)) === false)
                    {
                        return false;
                    }

                    if ((any |= 0) <= 0)
                    {
                        commands.shift()[0](any < 0 ? null : []);
                    }
                    else if (readBulk(list, any) === false)
                    {
                        return false;
                    }
                    break;

                case 13: //如果有多余的1310则丢弃
                    any = ++position;

                    if (buffer[any] === 10)
                    {
                        any++;
                    }

                    if (any >= buffer.length)
                    {
                        position = 0;
                        list.shift();
                    }
                    else
                    {
                        position = any;
                    }
                    break;

                case 10:
                    if (++position >= buffer.length)
                    {
                        position = 0;
                        list.shift();
                    }
                    break;

                case void 0:
                    list.shift();
                    break;

                default:
                    return raiseError();
            }
        }
    };


    //从上次挂起的位置继续解析
    let resume = (list, buffer) => {

        let array = bulk;
        let any = wait;

        if (any > 0)
        {
            if ((receive += buffer.length) >= any)
            {
                any = batchText(list, buffer, list.length - 1, any, receive);

                if (array.count > 0)
                {
                    array.push(any);

                    if (!--array.count)
                    {
                        commands.shift()[0](array);

                        bulk = [];
                        suspend = 0;
                        parse(list);
                    }
                    else if (readBulk(list, array.count) !== false)
                    {
                        suspend = 0;
                    }
                }
                else
                {
                    commands.shift()[0](any);

                    suspend = 0;
                    parse(list);
                }
            }
        }
        else if ((any = array.count) && readBulk(list, any) !== false)
        {
            suspend = 0;
        }
    };


    //返回接收函数
    return [buffer => {

        if (commands[0])
        {
            let list = cache;

            list.push(buffer);

            (suspend ? resume : parse)(list, buffer);
        }

    }, raiseError];


};