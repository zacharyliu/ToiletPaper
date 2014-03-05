var five = require('johnny-five');
var board = new five.Board();

var servos = require("./servos");
servos.init(board);

var indicators = require("./indicators");
indicators.init(board);

var paperLevelSensor = require("./paperLevelSensor");
paperLevelSensor.init(board);

var handSensor = require('./handSensor');
handSensor.init(board);

