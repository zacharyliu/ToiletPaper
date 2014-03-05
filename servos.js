var five = require("johnny-five");
var config = require('./config');

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
        done(false);
    }, 2000);
};

exports.cut = function(done) {
    if (!servoCutLeft || !servoCutRight || isDispensing || isCutting) done(true);

    console.log("servos.js", "Cut");
    isCutting = true;
    servoCutLeft.up();
    servoCutRight.up();

    setTimeout(function() {
        servoCutLeft.down();
        servoCutRight.down();
        isCutting = false;
        done(false);
    }, 1000);
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
            range: [10,170],
            isInverted: true
        }));
        servoCutLeft.down();

        servoCutRight = new ServoCut(new five.Servo({
            pin: config.pins.servoCutRight,
            range: [10,170]
        }));
        servoCutRight.down();

        board.repl.inject({
            servoDispense: servoDispense,
            servoCutLeft: servoCutLeft,
            servoCutRight: servoCutRight
        });
    });
};