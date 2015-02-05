var crypto = require("crypto");
var token = require("./../config").wechat.token;
exports.checkSignature = function (req) {
    var signature = req.query.signature,
      timestamp = req.query.timestamp,
      nonce = req.query.nonce,
      shasum = crypto.createHash('sha1'),
      arr = [token, timestamp, nonce];

    shasum.update(arr.sort().join(''),'utf-8');
    console.log("signature\n", signature);
    console.log("shasum.digest('hex')\n", shasum.digest('hex'));
    return shasum.digest('hex') == signature;
};