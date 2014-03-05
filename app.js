// Express setup
var express = require('express');
var app = module.exports = express.createServer();

// Johnny-five setup
var five = require("johnny-five");
var board = new five.Board();

var servos = require("./servos");
servos.init(board);

var T = require("./twitter");

var indicators = require("./indicators");

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

// Routes
app.get('/', function(req, res){
    res.render('index', { title: 'Express' })
});

app.get('/api/dispense', function(req, res) {
    servos.dispense(function(err) {
        if (!err) res.send();
    });
});

// Initialization
console.log("app.js", "Connecting to Arduino");
board.on("ready", function() {
    console.log("app.js", "Arduino connected");
    app.listen(process.env.PORT || 3000);
    console.log("app.js", "Express server listening on port %d in %s mode", app.address().port, app.settings.env)
});