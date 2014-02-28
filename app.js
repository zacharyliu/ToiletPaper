// Express setup
var express = require('express');
var app = module.exports = express.createServer();

// Johnny-five setup
var five = require("johnny-five");
var board = new five.Board();
var servo;

// Twit setup
var Twit = require('twit');
var T = new Twit({
    consumer_key: 'XNICKgCt3HTc5qjLCaVw',
    consumer_secret: 'dbzZdj35SV0lHSVVIuf6tb8WdeHy2Y1Z1D4mkJLys',
    access_token: '2343732187-prlOnbKIBqHRoSXNRIw5F9ZtVarJkpfXXK8UKOC',
    access_token_secret: 'l3qS4ryEWsz8zxPH78aBotoGBgDony2pv8aE8aGSEiWXt'
});

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

// Functions
function dispense() {
    servo.cw(1);
    setTimeout(function() {
        servo.stop();
    }, 2000);
}

// Routes
app.get('/', function(req, res){
    res.render('index', { title: 'Express' })
});

app.get('/api/dispense', function(req, res) {
    dispense();
    res.send();
});

// Initialization
console.log("Connecting to Arduino");
board.on("ready", function() {
    servo = new five.Servo({
        pin: 9,
        type: "continuous"
    });

    app.listen(process.env.PORT || 3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)
});
