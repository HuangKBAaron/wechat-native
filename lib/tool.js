var crypto = require("crypto");
var token = require("./../config").wechat.token;
exports.checkSignature = function (req) {
    var query = req.query;
    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));

    return shasum.digest('hex') === signature;
};