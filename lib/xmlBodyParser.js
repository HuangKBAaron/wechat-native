var xml2js = require("xml2js");
var checkSignature = require("./tool").checkSignature;
function mime(req) {
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}

var load = function (req, callback) {
    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        buf += chunk
    });
    req.on('end', function () {
        callback(null, buf);
    });
    req.once('error', callback);
};

var load2 = function (req, callback) {
    var buffers = [];
    req.on('data', function (trunk) {
        buffers.push(trunk);
    });
    req.on('end', function () {
        callback(null, Buffer.concat(buffers));
    });
    req.once('error', callback);
};

/**
 { xml:
   { ToUserName: [ 'toUser' ],
     FromUserName: [ 'fromUser' ],
     CreateTime: [ '1348831860' ],
     MsgType: [ 'text' ],
     Content: [ 'this is a test' ],
     MsgId: [ '1234567890123456' ] } }


 */
var getMessage = function (req, callback) {
    load(req, function (err, buf) {
        console.log('buf value:\n', buf);
        if (err) {
            return callback(err);
        }
        xml2js.parseString(buf, {trim: true}, callback);
    });
};

/**
 * 将xml2js解析出来的对象转换成直接可访问的对象
 { ToUserName: 'toUser',
  FromUserName: 'fromUser',
  CreateTime: '1348831860',
  MsgType: 'text',
  Content: 'this is a test',
  MsgId: '1234567890123456' }
 */
var formatMessage = function (result) {
    var message = {};
    if (typeof result === 'object') {
        for (var key in result) {
            if (!(result[key] instanceof Array) || result[key].length === 0) {
                continue;
            }
            if (result[key].length === 1) {
                var val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = [];
                result[key].forEach(function (item) {
                    message[key].push(formatMessage(item));
                });
            }
        }
    }
    return message;
};


var xmlBodyParser = function (req, res, next) {

    if (req.path !== '/weixin') {
        return next();
    }

    // ignore get and head method
    if (req.method !== 'POST') {
        console.log('url is /weixin but method is not post');
        return next();
    }

    // check Content-Type
    if ('text/xml' != mime(req)) {
        console.log('content type is not text/xml');
        return next();
    }
    if (!checkSignature(req)) {
        console.log('invalid signature');
        return res.status(401).end('Invalid signature');
    }
    getMessage(req, function (err, result) {
        if (err) {
            err.name = 'BadMessage' + err.name;
            return next(err);
        }
        console.log('xml value:\n', result);
        req.weixin = formatMessage(result.xml);
        console.log("req.weixin\n", req.weixin);
        next();
    });

};


exports.xmlBodyParser = xmlBodyParser;