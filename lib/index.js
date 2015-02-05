var xmlbuilder = require("xmlbuilder");
var checkSignature = require("./tool").checkSignature;

function buildXml(to, from, msgType, funFlag, callback){
    var xml = xmlbuilder.create('xml')
      .ele('ToUserName')
      .dat(to)
      .up()
      .ele('FromUserName')
      .dat(from)
      .up()
      .ele('CreateTime')
      .txt(new Date().getMilliseconds())
      .up()
      .ele('MsgType')
      .dat(msgType)
      .up();
    xml = callback(xml);
    return xml.ele('FuncFlag',{},funFlag).end({pretty:true});
}


var doGet = function (req, res) {
    if(!checkSignature(req)){
        res.end('error');
        return;
    }

    res.end(req.query.echostr);
};

var doPost = function (req, res) {
/*    if(!checkSource(req)){
        res.end('error');
        return;
    }*/

    res.send('');
};

exports.doGet = doGet;
exports.doPost = doPost;


