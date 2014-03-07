// Express setup
var express = require('express');
var app = module.exports = express.createServer();

// Johnny-five setup
var five = require("johnny-five");
var board = new five.Board();

var servos = require("./servos");
servos.init(board);

var indicators = require("./indicators");
indicators.init(board);

var paperLevelSensor = require("./paperLevelSensor");
paperLevelSensor.init(board);

var handSensor = require('./handSensor');
handSensor.init(board);

var twitter = require("./twitter");

var doge = require('./doge');

var coins = require('./coins');
coins.init(board);

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
        servos.dispense(function(err) {

        });
    });

    paperLevelSensor.on('paperLow', function() {
        if (!paperLow) {
            paperLow = true;
            console.log('Paper Low!');
            twitter.paperLow(function(err, reply) {
                console.log(err, reply);
            });
        }
    })
});
