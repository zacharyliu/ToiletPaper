var five = require("johnny-five");
var config = require('./config');
var async = require('async');
var zerorpc = require('zerorpc');

var servoDispense, servoCutLeft, servoCutRight;

ServoDispense = function(servo) {
    this.servo = servo;
    this.forwards = false;
    this.stopped = true;
};
ServoDispense.prototype.forward = function() {
    var that = this;
    this.forwards = true;
    this.stopped = false;
    async.whilst(function(){return that.forwards}, function(done) {
        async.series([
            function(done) {
                that.servo.cw(0.001);
                setTimeout(done, 100);
            },
//            function(done) {
//                that.servo.stop();
//                setTimeout(done, 200);
//            }
        ], function() {
            that.servo.stop();
            done();
        });
    }, function() {
        that.stopped = true;
    });
};
ServoDispense.prototype.reverse = function() {
    var that = this;
    this.stop(function() {
        that.servo.ccw(1);
    });
};
ServoDispense.prototype.stop = function(callback) {
    this.forwards = false;
    async.until(function(){return this.stopped}, function(done) {
        setTimeout(done, 100);
    }, function() {
        if (callback) callback();
    });
};

ServoCut = function(servo, reversed) {
    this.servo = servo;
};
ServoCut.prototype.up = function() {
    this.servo.max();
};
ServoCut.prototype.down = function() {
    this.servo.min();
    this.servo.stop();
};

var isDispensing = false;
var isCutting = false;

exports.dispense = function(done) {
    if (!servoDispense || isDispensing || isCutting) return done(true);

    console.log("servos.js", "Dispense");
    isDispensing = true;
    servoDispense.forward();

    setTimeout(function() {
        exports.stopAndCut(function() {
            done();
        });
    }, 2000);
};

exports.stopAndCut = function(done) {
    servoDispense.stop();
    isDispensing = false;

    exports.cut(function() {
        done(false);
    });
};

exports.cut = function(callback) {
    if (!servoCutLeft || !servoCutRight || isDispensing || isCutting) return callback(true);

    console.log("servos.js", "Cut");
    isCutting = true;

    async.series([
        function(done) {
            servoCutLeft.up();
            servoCutRight.up();
            setTimeout(done, 500);
        },
        function(done) {
            servoDispense.reverse();
            setTimeout(done, 700);
        },
        function(done) {
            servoDispense.stop();
            done();
        },
        function(done) {
            servoCutLeft.down();
            servoCutRight.down();
            isCutting = false;
            callback(null);
            done();
        }
    ]);
};

var client;

var _onLine = function(res) {
    console.log(res);
    exports.stopAndCut(function() {

    });
};

exports.init = function(board) {
    client = new zerorpc.Client();
    client.connect(config.zerorpc.CameraLines);
    client.invoke('subscribe', function(err, res, more) {
//        _onLine(res);
    });

    board.on("ready", function() {
        servoDispense = new ServoDispense(new five.Servo({
            pin: config.pins.servoDispense,
            type: "continuous"
        }));
        servoDispense.stop();

        servoCutLeft = new ServoCut(new five.Servo({
            pin: config.pins.servoCutLeft,
            range: [80,180], // 180
            isInverted: true
        }));
        servoCutLeft.down();

        servoCutRight = new ServoCut(new five.Servo({
            pin: config.pins.servoCutRight,
            range: [50,150] // 50
        }));
        servoCutRight.down();

        board.repl.inject({
            servoDispense: servoDispense,
            servoCutLeft: servoCutLeft,
            servoCutRight: servoCutRight
        });
    });
};