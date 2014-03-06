var five = require('johnny-five');
var util = require('util');
var events = require('events');
var config = require('./config');
var async = require('async');

var HandSensor = function() {
    this.handOver = false;
};
util.inherits(HandSensor, events.EventEmitter);

HandSensor.prototype.init = function(board) {
    var that = this;
    board.on('ready', function() {
        that.infraredEmitter = new five.Pin(config.pins.infraredEmitter);
        that.infraredDetector = new five.Pin(config.pins.infraredDetector);
        console.log('begin');
        that.loop();
    });
};

HandSensor.prototype.loop = function() {
    var that = this;
    async.series([
        function(callback) {
            that.infraredEmitter.high();
            that.infraredDetector.query(function(state) {
                callback(null, that.infraredDetector.value);
            });
        },
        function(callback) {
            setTimeout(callback, 50);
        },
        function(callback) {
            that.infraredEmitter.low();
            that.infraredDetector.query(function(state) {
                callback(null, that.infraredDetector.value);
            });
        },
    ], function(err, results) {
        var diff = results[2] - results[0];
        if (diff >= config.handSensorThreshold && !that.handOver) {
            that.handOver = true;
            that.emit('handOver');
        } else if (diff < config.handSensorThreshold && that.handOver) {
            that.handOver = false;
            that.emit('handOut');
        }
    });
    setTimeout(function() {
        that.loop();
    }, 100);
};

module.exports = new HandSensor();