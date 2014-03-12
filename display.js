var five = require('johnny-five');
var config = require('./config');

var Display = function() {};

Display.prototype.init = function(board) {
    var that = this;
    board.on('ready', function() {
        that.pinA = new five.Pin(config.pins.display.A);
        that.pinB = new five.Pin(config.pins.display.B);
        that.pinC = new five.Pin(config.pins.display.C);
    });
};

Display.prototype.write = function(number) {
    number = parseInt(number);
    if (number < 0) {
        number = 0;
    }
    if (number > 7) {
        number = 7;
    }
    this.pinA.write((number & 1));
    this.pinB.write((number & 1<<1)>>1);
    this.pinC.write((number & 1<<2)>>2);
    return true;
};

module.exports = new Display();