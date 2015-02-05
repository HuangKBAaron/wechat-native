var xml2js = require("xml2js");

function mime(req) {
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}

var xmlBodyParser = function (req, res, next) {
    if (req.url !== '/weixin') {
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

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        buf += chunk
    });
    req.on('end', function () {
        console.log("buf\n", buf);
        var parseString = xml2js.parseString;
        parseString(buf, function (err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                req.body = json;
                next();
            }
        });
    });
};
exports.xmlBodyParser = xmlBodyParser;