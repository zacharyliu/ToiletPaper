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
        that.ping.on('change', function(err, val) {
            console.log(this.cm);
            if (this.cm < 1000 && this.cm > config.paperLowDistanceCm) {
                that.emit("paperLow");
            }
        });
    });
};

module.exports = new PaperLevelSensor();