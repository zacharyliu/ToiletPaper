var Twit = require('twit');
exports.T = new Twit({
    consumer_key: '0T0gt00QFs9N0iYAAKK24Q',
    consumer_secret: 'k459dPbm2DCI500VRXqDPm3wJaK4ho2SPfQiTshE',
    access_token: '2343732187-u4yJaigwjmCcUozsqR9V0Y4TR1QFMtyWRZ8E27v',
    access_token_secret: 'VIDmZxjkpsbr1JEFi4Aj9xLKqkC3wjMwM31lDBcWT32wM'
});

exports.paperLow = function(callback) {
    exports.T.post('statuses/update', {status: 'Paper Low!'}, function(err, reply) {
        callback(err, reply);
    });
};

exports.onDispense = function(balance, callback) {
    exports.T.post('statuses/update', {status: 'Sheet dispensed at ' + (new Date()) + '; balance: ' + balance}, function(err, reply) {
        callback(err, reply);
    })
};