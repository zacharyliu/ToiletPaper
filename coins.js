var five = require('johnny-five');
var zerorpc = require('zerorpc');
var config = require('./config');
var util = require('util');
var events = require('events');

var Coins = function() {
    var that = this;
    this.client = new zerorpc.Client();
    this.client.connect(config.zerorpc.CameraCoins);
    this.client.invoke('subscribe', function(err, res, more) {
        that._onCoin(res);
    });
};
util.inherits(Coins, events.EventEmitter);

Coins.prototype.init = function(board) {
    var that = this;
    this.coinProcessed = false;
    this.board = board;
    board.on('ready', function() {
        that.servo = new five.Servo({
            pin: config.pins.servoCoins,
            range: [120, 200]
        });
        that.close();
    });
    board.repl.inject({
        servoCoins: that.servo
    });
};

Coins.prototype.open = function() {
    if (this.servo) this.servo.min();
};

Coins.prototype.close = function() {
    if (this.servo) this.servo.max();
};

Coins.prototype._onCoin = function(value) {
    var that = this;
    if (this.coinProcessed) return;
    this.coinProcessed = true;
    this.emit('coin', value);
    this.open();
    setTimeout(function() {
        that.close();
        that.coinProcessed = false;
    }, 1000);
};

module.exports = new Coins();
