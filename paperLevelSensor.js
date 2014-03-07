var five = require('johnny-five');
var util = require('util');
var events = require('events');
var config = require('./config');
var indicators = require('./indicators');

var PaperLevelSensor = function() {};

util.inherits(PaperLevelSensor, events.EventEmitter);

PaperLevelSensor.prototype.init = function(board) {
    var that = this;
    this.paperLow = true;
    board.on('ready', function() {
        that.ping = new five.Ping(config.pins.paperLevelSensor);
        that.ping.on('data', function(err, val) {
//            console.log(that.paperLow, this.cm);
            if (!that.paperLow && this.cm < 1000 && this.cm > config.paperLowDistanceCm) {
                that.paperLow = true;
                that.emit("paperLow");
            }
        });
    });

    indicators.on('doorClosed', function() {
        that.paperLow = false;
    });

    indicators.on('doorOpen', function() {
        that.paperLow = true;
    });
};

module.exports = new PaperLevelSensor();