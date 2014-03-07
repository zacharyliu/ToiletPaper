var five = require('johnny-five');
var util = require('util');
var events = require('events');
var config = require('./config');

var Indicators = function() {};

util.inherits(Indicators, events.EventEmitter);

Indicators.prototype.init = function(board) {
    board.on('ready', function() {
        this.led = new five.Led({
            pin: 13
        });

        this.led.pulse();

        this.doorSensor = new five.Button({
            pin: config.pins.doorSensor,
            invert: true,
            isPullup: true
        });
    });
};

module.exports = new Indicators();