var zerorpc = require('zerorpc');
var config = require('./config');

var client = new zerorpc.Client();
client.connect(config.zerorpc.CameraCoins);
client.invoke('subscribe', function(err, res, more) {
    console.log(res);
});