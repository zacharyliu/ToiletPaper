var five = require('johnny-five');
var board = new five.Board();

var config = require('./config');


board.on("ready", function() {
    //Create new Ping and show distance on change
    var ping = new five.Ping(config.pins.paperLevelSensor);

    ping.on("data", function( err, value ) {
        console.log('Object is ' + this.cm + ' cm away');
    });
});
