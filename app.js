// Express setup
var express = require('express');
var app = module.exports = express.createServer();

// Johnny-five setup
var five = require("johnny-five");
var board = new five.Board();

var config = require('./config');

var servos = require("./servos");
servos.init(board);

var indicators = require("./indicators");
indicators.init(board);

var paperLevelSensor = require("./paperLevelSensor");
paperLevelSensor.init(board);

var handSensor = require('./handSensor');
handSensor.init(board);

var display = require('./display');
display.init(board);

var twitter = require("./twitter");

var coins = require('./coins');
coins.init(board);

var balance = 0;

function addBalance(amount) {
    balance += amount;
    console.log('Adding', amount, 'to balance');
    console.log('New balance:', balance);
    updateDisplay();
}

function updateDisplay() {
    display.write(balance / config.pricePerSheet);
}

var io = require('socket.io-client');
var socket = io.connect(config.dogeCloud);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Express routes
app.get('/', function(req, res){
    res.render('index', { title: 'Express' })
});

app.get('/api/dispense', function(req, res) {
    servos.dispense(function(err) {
        if (!err) res.send();
    });
});

var paperLow = false;

// Initialization
console.log("app.js", "Connecting to Arduino");
board.on("ready", function() {
    console.log("app.js", "Arduino connected");
    app.listen(process.env.PORT || 3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

    // Event routing
    handSensor.on('handOver', function() {
        console.log('app.js', 'Event (handSensor): handOver');
        if (balance >= config.pricePerSheet) {
            balance -= config.pricePerSheet;
            updateDisplay();
            console.log('New balance:', balance);
            servos.dispense(function(err) {});
        } else {
            console.log("Please insert coin");
        }
    });

    paperLevelSensor.on('paperLow', function() {
//        if (!paperLow) {
//            paperLow = true;
            console.log('Paper Low!');
            twitter.paperLow(function(err, reply) {
                console.log(err, reply);
            });
//        }
    });

    coins.on('coin', function(value) {
        addBalance(value);
    });

    socket.on('updatecredit', function(data) {
        addBalance(data.delta);
    });

    setTimeout(function() {
        addBalance(7 * config.pricePerSheet);
    }, 1000);
});
