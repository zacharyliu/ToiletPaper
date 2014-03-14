var Twit = require('twit');
var config = require('./config');

exports.T = new Twit(config.twit);

exports.paperLow = function(callback) {
    exports.T.post('statuses/update', {status: 'Paper Low!'}, function(err, reply) {
        callback(err, reply);
    });
};

exports.onDispense = function(balance, callback) {
    exports.T.post('statuses/update', {status: 'Sheet dispensed at ' + (new Date()) + '; balance: ' + balance}, function(err, reply) {
        callback(err, reply);
    })
};