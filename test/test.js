const parser = require('../lib/parser');

const commands = [];


const parse = parser(commands);



function addTest(name, value1, value2) {

    new Promise((...args) => {

        commands.push(args);

    }).then(result => {
        
        if (value1)
        {
            if (result instanceof Array)
            {
                result = result.join('');
            }

            console.log(name, result === value1);
        }

    }).catch(err => {
        
        if (value2)
        {
            console.log(name, err === value2);
        }
        else
        {
            console.log(name, 'error:', err);
        }

    });
};


addTest('test 1', ['abcde中国要有', '0123456789', '123456'].join(''));

addTest('test 2', ['abcde中国要有', '0123中456789', '123456'].join(''));

addTest('test 3', '中国');

addTest('test 4', '', '中国');

addTest('test 5', 123);


parse(new Buffer(['*3', '+abcde中国要有', '$10', '0123456789', ':123456', ''].join('\r\n')));

parse(new Buffer(['*3', '+abcde中国要有', '$1'].join('\r\n')));
parse(new Buffer('3\r\n0123中').slice(0, -1));
parse(new Buffer('中456').slice(2));
parse(new Buffer('789\r\n$6\r\n123456\r\n'));

parse(new Buffer('+中国\r\n'));

parse(new Buffer('-中国\r\n'));

parse(new Buffer(':123\r\n'));