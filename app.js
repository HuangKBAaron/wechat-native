var express = require("express");
var logger = require("morgan");
var xmlBodyParser = require("./lib/xmlBodyParser").xmlBodyParser;
var weixin = require("./lib/index");
var app = express();

app.set('port', process.env.PORT || 80);
app.use(xmlBodyParser);
app.use(logger('combined'));
app.get('/weixin', weixin.doGet);
app.post('/weixin', weixin.doPost);


app.listen(app.get('port'), function () {
    console.log('Server listening on:', app.get('port'));
});