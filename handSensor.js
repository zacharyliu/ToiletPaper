var five = require('johnny-five');
var util = require('util');
var events = require('events');
var config = require('./config');
var async = require('async');

var HandSensor = function() {};
util.inherits(HandSensor, events.EventEmitter);

HandSensor.prototype.init = function(board) {
    var that = this;
    board.on('ready', function() {
        that.infraredEmitter = new five.Pin(config.pins.infraredEmitter);
        that.infraredDetector = new five.Pin(config.pins.infraredDetector);

//        that.loop();
    });
};

HandSensor.prototype.loop = function() {
    var that = this;
    async.series([
        function(callback) {
            that.infraredEmitter.high();
            that.infraredDetector.query(function(value) {
                callback(null, value);
            });
        },
        function(callback) {
            that.infraredEmitter.low();
            that.infraredDetector.query(function(value) {
                callback(null, value);
            });
        },
    ], function(err, results) {
        var diff = results[0] - results[1];
        if (diff > config.handSensorThreshold) {
            that.emit('handOver');
        }
    });
    setTimeout(this.loop, 200);
};

module.exports = new HandSensor();