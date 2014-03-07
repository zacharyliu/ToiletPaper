var five = require("johnny-five");
var config = require('./config');
var async = require('async');

var servoDispense, servoCutLeft, servoCutRight;

ServoDispense = function(servo) {
    this.servo = servo;
};
ServoDispense.prototype.forward = function() {
    this.servo.cw(1);
};
ServoDispense.prototype.reverse = function() {
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
    if (!servoDispense || isDispensing || isCutting) done(true);

    console.log("servos.js", "Dispense");
    isDispensing = true;
    servoDispense.forward();

    setTimeout(function() {
        servoDispense.stop();
        isDispensing = false;

        exports.cut(function() {
            done(false);
        });
    }, 2000);
};

exports.cut = function(callback) {
    if (!servoCutLeft || !servoCutRight || isDispensing || isCutting) callback(true);

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

exports.init = function(board) {
    board.on("ready", function() {
        servoDispense = new ServoDispense(new five.Servo({
            pin: config.pins.servoDispense,
            type: "continuous"
        }));
        servoDispense.stop();

        servoCutLeft = new ServoCut(new five.Servo({
            pin: config.pins.servoCutLeft,
            range: [60,140],
            isInverted: true
        }));
        servoCutLeft.down();

        servoCutRight = new ServoCut(new five.Servo({
            pin: config.pins.servoCutRight,
            range: [60,140]
        }));
        servoCutRight.down();

        board.repl.inject({
            servoDispense: servoDispense,
            servoCutLeft: servoCutLeft,
            servoCutRight: servoCutRight
        });
    });
};