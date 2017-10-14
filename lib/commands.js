const redis = require('./client').prototype;



/**
 * 对象转数组
 * @param {*} values 
 */
function toArray(values) {

    let list = [];

    if (values)
    {
        for (let name in values)
        {
            list.push(name, values[name]);
        }
    }

    return list;
};



//Key（键）


redis.del = function (...keys) {

    return this.command('DEL', ...arguments);
};


redis.dump = function (key) {

    return this.command('DUMP', ...arguments);
};


redis.exists = function (key) {

    return this.command('EXISTS', ...arguments);
};


redis.expire = function (key, seconds) {

    return this.command('EXPIRE', ...arguments);
};


redis.expireat = function (key, timestamp) {

    return this.command('EXPIREAT', ...arguments);
};


redis.keys = function (pattern) {

    return this.command('KEYS', ...arguments);
};


redis.migrate = function (host, port, key, destination_db, timeout, copy, replace) {

    return this.command('MIGRATE', ...arguments);
};


redis.move = function (key, db) {

    return this.command('MOVE', ...arguments);
};


redis.object = function (subcommand, ...args) {

    return this.command('OBJECT', ...arguments);
};


redis.persist = function (key) {

    return this.command('PERSIST', ...arguments);
};


redis.pexpire = function (key, milliseconds) {

    return this.command('PEXPIRE', ...arguments);
};


redis.pexpireat = function (key, milliseconds_timestamp) {

    return this.command('PEXPIREAT', ...arguments);
};


redis.pttl = function (key) {

    return this.command('PTTL', ...arguments);
};


redis.randomkey = function () {

    return this.send('*1\r\n$9\r\nRANDOMKEY\r\n');
};


redis.rename = function (key, newkey) {

    return this.command('RENAME', ...arguments);
};


redis.renamenx = function (key, newkey) {

    return this.command('RENAMENX', ...arguments);
};


redis.restore = function (key, ttl, serialized_value) {

    return this.command('RESTORE', ...arguments);
};


redis.sort = function (key, BY, pattern, LIMIT, offset, count, GET, pattern/*, [GET, pattern]* */, ASC_OR_DESC, ALPHA, STORE, destination) {

    return this.command('SORT', ...arguments);
};


redis.ttl = function (key) {

    return this.command('TTL', ...arguments);
};


redis.type = function (key) {

    return this.command('TYPE', ...arguments);
};


redis.scan = function (cursor, MATCH, pattern, COUNT, count) {

    return this.command('SCAN', ...arguments);
};



//String（字符串）
redis.append = function (key, value) {

    return this.command('APPEND', ...arguments);
};


redis.bitcount = function (key, start, end) {

    return this.command('BITCOUNT', ...arguments);
};


redis.bitop = function (operation, destkey, ...keys) {

    return this.command('BITOP', ...arguments);
};


redis.decr = function (key) {

    return this.command('DECR', ...arguments);
};


redis.decrby = function (key, decrement) {

    return this.command('DECRBY', ...arguments);
};


redis.get = function (key) {

    return this.command('GET', ...arguments);
};


redis.getbit = function (key, offset) {

    return this.command('GETBIT', ...arguments);
};


redis.getrange = function (key, start, end) {

    return this.command('GETRANGE', ...arguments);
};


redis.getset = function (key, value) {

    return this.command('GETSET', ...arguments);
};


redis.incr = function (key) {

    return this.command('INCR', ...arguments);
};


redis.incrby = function (key, increment) {

    return this.command('INCRBY', ...arguments);
};


redis.incrbyfloat = function (key, increment) {

    return this.command('INCRBYFLOAT', ...arguments);
};


redis.mget = function (...keys) {

    return this.command('MGET', ...arguments);
};


redis.mset = function (values) {

    return this.command('MSET', ...toArray(values));
};


redis.msetnx = function (values) {

    return this.command('MSETNX', ...toArray(values));
};


redis.psetex = function (key, milliseconds, value) {

    return this.command('PSETEX', ...arguments);
};


redis.set = function (key, value, EX, seconds, PX, milliseconds, NX_OR_XX) {

    return this.command('SET', ...arguments);
};


redis.setbit = function (key, offset, value) {

    return this.command('SETBIT', ...arguments);
};


redis.setex = function (key, seconds, value) {

    return this.command('SETEX', ...arguments);
};


redis.setnx = function (key, value) {

    return this.command('SETNX', ...arguments);
};


redis.setrange = function (key, offset, value) {

    return this.command('SETRANGE', ...arguments);
};


redis.strlen = function (key) {

    return this.command('STRLEN', ...arguments);
};



//Hash（哈希表）


redis.hdel = function (key, ...fields) {

    return this.command('HDEL', ...arguments);
};


redis.hexists = function (key, field) {

    return this.command('HEXISTS', ...arguments);
};


redis.hget = function (key, field) {

    return this.command('HGET', ...arguments);
};


redis.hgetall = function (key) {

    return this.command('HGETALL', ...arguments);
};


redis.hincrby = function (key, field, increment) {

    return this.command('HINCRBY', ...arguments);
};


redis.hincrbyfloat = function (key, field, increment) {

    return this.command('HINCRBYFLOAT', ...arguments);
};


redis.hkeys = function (key) {

    return this.command('HKEYS', ...arguments);
};


redis.hlen = function (key) {

    return this.command('HLEN', ...arguments);
};


redis.hmget = function (key, ...fields) {

    return this.command('HMGET', ...arguments);
};


redis.hmset = function (key, values) {

    return this.command('HMSET', key, ...toArray(values));
};


redis.hset = function (key, field, value) {

    return this.command('HSET', ...arguments);
};


redis.hsetnx = function (key, field, value) {

    return this.command('HSETNX', ...arguments);
};


redis.hvals = function (key) {

    return this.command('HVALS', ...arguments);
};


redis.hscan = function (key, cursor, MATCH, pattern, COUNT, count) {

    return this.command('HSCAN', ...arguments);
};



//List（列表）


redis.blpop = function (...keys/*, timeout*/) {

    return this.command('BLPOP', ...arguments);
};


redis.brpop = function (...keys/*, timeout*/) {

    return this.command('BRPOP', ...arguments);
};


redis.brpoplpush = function (source, destination, timeout) {

    return this.command('BRPOPLPUSH', ...arguments);
};


redis.lindex = function (key, index) {

    return this.command('LINDEX', ...arguments);
};


redis.linsert = function (key, BEFORE_OR_AFTER, pivot, value) {

    return this.command('LINSERT', ...arguments);
};


redis.llen = function (key) {

    return this.command('LLEN', ...arguments);
};


redis.lpop = function (key) {

    return this.command('LPOP', ...arguments);
};


redis.lpush = function (key, ...values) {

    return this.command('LPUSH', ...arguments);
};


redis.lpushx = function (key, value) {

    return this.command('LPUSHX', ...arguments);
};


redis.lrange = function (key, start, stop) {

    return this.command('LRANGE', ...arguments);
};


redis.lrem = function (key, count, value) {

    return this.command('LREM', ...arguments);
};


redis.lset = function (key, index, value) {

    return this.command('LSET', ...arguments);
};


redis.ltrim = function (key, start, stop) {

    return this.command('LTRIM', ...arguments);
};


redis.rpop = function (key) {

    return this.command('RPOP', ...arguments);
};


redis.rpoplpush = function (source, destination) {

    return this.command('RPOPLPUSH', ...arguments);
};


redis.rpush = function (key, ...values) {

    return this.command('RPUSH', ...arguments);
};


redis.rpushx = function (key, value) {

    return this.command('RPUSHX', ...arguments);
};



//Set（集合）


redis.sadd = function (key, ...members) {

    return this.command('SADD', ...arguments);
};


redis.scard = function (key) {

    return this.command('SCARD', ...arguments);
};


redis.sdiff = function (...keys) {

    return this.command('SDIFF', ...arguments);
};


redis.sdiffstore = function (destination, ...keys) {

    return this.command('SDIFFSTORE', ...arguments);
};


redis.sinter = function (...keys) {

    return this.command('SINTER', ...arguments);
};


redis.sinterstore = function (destination, ...keys) {

    return this.command('SINTERSTORE', ...arguments);
};


redis.sismember = function (key, member) {

    return this.command('SISMEMBER', ...arguments);
};


redis.smembers = function (key) {

    return this.command('SMEMBERS', ...arguments);
};


redis.smove = function (source, destination, member) {

    return this.command('SMOVE', ...arguments);
};


redis.spop = function (key) {

    return this.command('SPOP', ...arguments);
};


redis.srandmember = function (key, count) {

    return this.command('SRANDMEMBER', ...arguments);
};


redis.srem = function (key, ...members) {

    return this.command('SREM', ...arguments);
};


redis.sunion = function (...keys) {

    return this.command('SUNION', ...arguments);
};


redis.sunionstore = function (destination, ...keys) {

    return this.command('SUNIONSTORE', ...arguments);
};


redis.sscan = function (key, cursor, MATCH, pattern, COUNT, count) {

    return this.command('SSCAN', ...arguments);
};



//SortedSet（有序集合）


redis.zadd = function (key, values) {

    return this.command('ZADD', key, ...toArray(values));
};


redis.zcard = function (key) {

    return this.command('ZCARD', ...arguments);
};


redis.zcount = function (key, min, max) {

    return this.command('ZCOUNT', ...arguments);
};


redis.zincrby = function (key, increment, member) {

    return this.command('ZINCRBY', ...arguments);
};


redis.zrange = function (key, start, stop, WITHSCORES) {

    return this.command('ZRANGE', ...arguments);
};


redis.zrangebyscore = function (key, min, max, WITHSCORES, LIMIT, offset, count) {

    return this.command('ZRANGEBYSCORE', ...arguments);
};


redis.zrank = function (key, member) {

    return this.command('ZRANK', ...arguments);
};


redis.zrem = function (key, ...members) {

    return this.command('ZREM', ...arguments);
};


redis.zremrangebyrank = function (key, start, stop) {

    return this.command('ZREMRANGEBYRANK', ...arguments);
};


redis.zremrangebyscore = function (key, max, min, WITHSCORES, LIMIT, offset, count) {

    return this.command('ZREMRANGEBYSCORE', ...arguments);
};


redis.zrevrange = function (key, start, stop, WITHSCORES) {

    return this.command('ZREVRANGE', ...arguments);
};


redis.zrevrangebyscore = function (key, max, min, WITHSCORES, LIMIT, offset, count) {

    return this.command('ZREVRANGEBYSCORE', ...arguments);
};


redis.zrevrank = function (key, member) {

    return this.command('ZREVRANK', ...arguments);
};


redis.zscore = function (key, member) {

    return this.command('ZSCORE', ...arguments);
};


redis.zunionstore = function (destination, numkeys, ...keys/*, WEIGHTS, ...weights, AGGREGATE, SUM_OR_MIN_OR_MAX*/) {

    return this.command('ZUNIONSTORE', ...arguments);
};


redis.zinterstore = function (destination, numkeys, ...keys/*, WEIGHTS, ...weights, AGGREGATE, SUM_OR_MIN_OR_MAX*/) {

    return this.command('ZINTERSTORE', ...arguments);
};


redis.zscan = function (key, cursor, MATCH, pattern, COUNT, count) {

    return this.command('ZSCAN', ...arguments);
};



//Pub/Sub（发布/订阅）


redis.psubscribe = function (...patterns) {

    return this.command('PSUBSCRIBE', ...arguments);
};


redis.publish = function (channel, message) {

    return this.command('PUBLISH', ...arguments);
};


redis.pubsub = function (subcommand, ...args) {

    return this.command('PUBSUB', ...arguments);
};


redis.punsubscribe = function (...patterns) {

    return this.command('PUNSUBSCRIBE', ...arguments);
};


redis.subscribe = function (...channels) {

    return this.command('SUBSCRIBE', ...arguments);
};


redis.unsubscribe = function (...channels) {

    return this.command('UNSUBSCRIBE', ...arguments);
};




//Transaction（事务）


redis.discard = function () {

    return this.send('*1\r\n$7\r\nDISCARD\r\n');
};


redis.exec = function () {

    return this.send('*1\r\n$4\r\nEXEC\r\n');
};


redis.multi = function () {

    return this.command('*1\r\n$5\r\nMULTI\r\n');
};


redis.unwatch = function () {

    return this.command('*1\r\n$7\r\nUNWATCH\r\n');
};


redis.watch = function (...keys) {

    return this.command('WATCH', ...arguments);
};



//Script（脚本）


redis.eval = function (script, numkeys, ...keys/*, ...args*/) {

    return this.command('EVAL', ...arguments);
};


redis.evalsha = function (sha1, numkeys, ...keys/*, ...args*/) {

    return this.command('EVALSHA', ...arguments);
};


redis.script_exists = function (...scripts) {

    return this.command('SCRIPT EXISTS', ...arguments);
};


redis.script_flush = function () {

    return this.send('*1\r\n\$12\r\nSCRIPT FLUSH\r\n');
};


redis.script_kill = function () {

    return this.send('*1\r\n\$11\r\nSCRIPT KILL\r\n');
};


redis.script_load = function (script) {

    return this.command('SCRIPT LOAD', ...arguments);
};



//Connection（连接）


redis.auth = function (password) {

    return this.command('AUTH', ...arguments);
};


redis.echo = function (message) {

    return this.command('ECHO', ...arguments);
};


redis.ping = function () {

    return this.send('*1\r\n$4\r\nPING\r\n');
};


redis.quit = function () {

    return this.send('*1\r\n$4\r\nQUIT\r\n');
};


redis.select = function (index) {

    return this.command('SELECT', ...arguments);
};



//Server（服务器）
redis.bgrewriteaof = function () {

    return this.send('*1\r\n$12\r\nBGREWRITEAOF\r\n');
};


redis.bgsave = function () {

    return this.send('*1\r\n$6\r\nBGSAVE\r\n');
};


redis.client_getname = function () {

    return this.send('*1\r\n$14\r\nCLIENT GETNAME\r\n');
};


redis.client_kill = function (ip_and_port) {

    return this.command('CLIENT KILL', ...arguments);
};


redis.client_list = function () {

    return this.commsendand('*1\r\n$11\r\nCLIENT LIST\r\n');
};


redis.client_setname = function (connection_name) {

    return this.command('CLIENT SETNAME', ...arguments);
};


redis.config_get = function (parameter) {

    return this.command('CONFIG GET', ...arguments);
};


redis.config_resetstat = function () {

    return this.send('*1\r\n$16\r\nCONFIG RESETSTAT\r\n');
};


redis.config_rewrite = function () {

    return this.send('*1\r\n$14\r\nCONFIG REWRITE\r\n');
};


redis.config_set = function (parameter, value) {

    return this.command('CONFIG SET', ...arguments);
};


redis.dbsize = function () {

    return this.send('*1\r\n$6\r\nDBSIZE\r\n');
};


redis.debug_object = function (key) {

    return this.command('DEBUG OBJECT', ...arguments);
};


//执行一个不合法的内存访问从而让 Redis 崩溃，仅在开发时用于 BUG 模拟。
redis.debug_segfault = function () {

    return this.send('*1\r\n$14\r\nDEBUG SEGFAULT\r\n');
};


redis.flushall = function () {

    return this.send('*1\r\n$8\r\nFLUSHALL\r\n');
};


redis.flushdb = function () {

    return this.send('*1\r\n$7\r\nFLUSHDB\r\n');
};


redis.info = function (section) {

    return this.command('INFO', ...arguments);
};


redis.lastsave = function () {

    return this.send('*1\r\n$8\r\nLASTSAVE\r\n');
};


redis.monitor = function () {

    return this.send('*1\r\n$7\r\nMONITOR\r\n');
};


redis.psync = function (master_run_id, offset) {

    return this.command('PSYNC', ...arguments);
};


redis.save = function () {

    return this.send('*1\r\n$4\r\nSAVE\r\n');
};


redis.shutdown = function (SAVE_OR_NOSAVE) {

    return this.command('SHUTDOWN', ...arguments);
};


redis.slaveof = function (host, port) {

    return this.command('SLAVEOF', ...arguments);
};


redis.slowlog = function (subcommand, argument) {

    return this.command('SLOWLOG', ...arguments);
};


redis.sync = function () {

    return this.send('*1\r\n$4\r\nSYNC\r\n');
};


redis.time = function (...keys) {

    return this.send('*1\r\n$4\r\nTIME\r\n');
};