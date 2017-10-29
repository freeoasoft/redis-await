# redis-await
light weight and high performance async nodejs redis client! support await

![](https://www.travis-ci.org/freeoasoft/redis-await.svg?branch=master)

## Installation
`npm install redis-await`

## Usage
```
const RedisClient = require('redis-await');

(async function () {

    let client = new RedisClient(/*{ host: '127.0.0.1', port: 6379, pool: 2 }*/);
    let value;
    
    await client.ready();
    
    value = await client.hset('test', 'key', '123\r\n456');
    value = await client.hget('test', 'key');

    value = await client.hmset('test', { key1: 1, key2: 2 });
    value = await client.hmget('test', 'key1', 'key2');

    value = await client.hgetall('test');

    //use command
    value = await client.command('HGETALL', 'test');

    //direct send redis instruction
    value = await client.send('*2\r\n$7\r\nHGETALL\r\n$4\r\ntest\r\n');

})();
```