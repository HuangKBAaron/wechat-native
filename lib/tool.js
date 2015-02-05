var crypto = require("crypto");
var token = require("./../config").wechat.token;
exports.checkSignature = function (req) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    console.log("shasum\n", shasum);
    console.log("arr.join('')\n", arr.join(''));
    console.log("digest\n", shasum.digest('hex'));
    console.log("signature\n", signature);
    shasum.update(arr.join(''));
    return shasum.digest('hex') === signature;
};