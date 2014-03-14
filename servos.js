var five = require("johnny-five");
var config = require('./config');
var async = require('async');
var zerorpc = require('zerorpc');

var servoDispense, servoCutLeft, servoCutRight;

ServoDispense = function(servo) {
    this.servo = servo;
};
ServoDispense.prototype.forward = function() {
    this.stop();
    this.servo.cw(1);
};
ServoDispense.prototype.reverse = function() {
    this.stop();
    this.servo.ccw(1);
};
ServoDispense.prototype.stop = function() {
    this.servo.stop();
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
    if (!servoDispense || !isDispensing) return done(true);
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
            servoDispense.forward();
            servoCutLeft.up();
            servoCutRight.up();
            setTimeout(done, 300);
        },
        function(done) {
            servoDispense.stop();
            setTimeout(done, 500);
        },
        function(done) {
            servoDispense.reverse();
            servoCutLeft.down();
            servoCutRight.down();
            setTimeout(done, 300);
        },
        function(done) {
            servoDispense.stop();
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
        if (err) return;
        _onLine(res);
    });

    board.on("ready", function() {
        servoDispense = new ServoDispense(new five.Servo({
            pin: config.pins.servoDispense,
            type: "continuous"
        }));
        setTimeout(function(){
            servoDispense.stop();
        }, 1000);

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