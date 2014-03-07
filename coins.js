var five = require('johnny-five');
var zerorpc = require('zerorpc');
var config = require('./config');
var util = require('util');
var events = require('events');

var Coins = function() {
    var that = this;
    this.client = new zerorpc.Client();
    this.client.connect(config.zerorpc.CameraCoins);
    this.client.invoke('onCoin', function(err, res, more) {
        that._onCoin(res);
    });
};
util.inherits(Coins, events.EventEmitter);

Coins.prototype.init = function(board) {
    var that = this;
    this.board = board;
    board.on('ready', function() {
        that.servo = new five.Servo({
            pin: config.pins.servoCoins,
            range: [0,90]
        });
    });
    board.repl.inject({
        servoCoins: that.servo
    });
};

Coins.prototype.open = function() {
    this.servo.min();
};

Coins.prototype.close = function() {
    this.servo.max();
};

Coins.prototype._onCoin = function(value) {
    var that = this;
    console.log(value);
    this.open();
    setTimeout(function() {
        that.close();
    }, 1000);
};

module.exports = new Coins();
