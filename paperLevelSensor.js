var five = require('johnny-five');
var util = require('util');
var events = require('events');
var config = require('./config');

var PaperLevelSensor = function() {};

util.inherits(PaperLevelSensor, events.EventEmitter);

PaperLevelSensor.prototype.init = function(board) {
    var that = this;
    board.on('ready', function() {
        that.ping = new five.Ping(config.pins.paperLevelSensor);
        that.ping.on('data', function(err, val) {
            var cm = this.cm;
            if (cm < 1000 && cm > config.paperLowDistanceCm) {
                that.emit("paperLow");
            }
        });
    });
};

module.exports = new PaperLevelSensor();