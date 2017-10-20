let RedisClient = require('../lib');

(async function () {

    let client = new RedisClient(/*{ host: '127.0.0.1', port: 6379 }*/);
    
    await client.connect();

    let date = new Date();

    for (var i = 0; i < 1000; i++)
    {
        let value;

        value = await client.hset('test', 'a', '123\r\n456');
        value = await client.hget('test', 'a');

        value = await client.hset('test', 'b', '1234567891011');
        value = await client.hget('test', 'b');

        value = await client.hset('test', 'c', '123\r\n456');
        value = await client.hget('test', 'c');

        value = await client.hset('test', 'd', '1234567891011');
        value = await client.hget('test', 'd');

        value = await client.hset('test', 'e', '123\r\n456');
        value = await client.hget('test', 'e');

        value = await client.hmset('test', { f: 1, g: 2, h: '' });
        value = await client.hmget('test', 'f', 'g');

        value = await client.hgetall('test');
    }

    console.log(new Date() - date);

})();