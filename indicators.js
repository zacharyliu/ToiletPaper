var five = require('johnny-five');
var util = require('util');
var events = require('events');
var config = require('./config');

var Indicators = function() {};

util.inherits(Indicators, events.EventEmitter);

Indicators.prototype.init = function(board) {
    var that = this;
    board.on('ready', function() {
        that.led = new five.Led({
            pin: 13
        });

//        that.led.pulse();

        that.doorSensor = new five.Button({
            pin: config.pins.doorSensor,
            isPullup: true
        });

        that.doorSensor.on('up', function() {
//            console.log('indicators.js', 'door closed');
            that.emit('doorClosed');
        });

        that.doorSensor.on('down', function() {
//            console.log('indicators.js', 'door open');
            that.emit('doorOpen');
        });
    });
};

module.exports = new Indicators();