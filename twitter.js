var Twit = require('twit');
exports.T = new Twit({
    consumer_key: 'XNICKgCt3HTc5qjLCaVw',
    consumer_secret: 'dbzZdj35SV0lHSVVIuf6tb8WdeHy2Y1Z1D4mkJLys',
    access_token: '2343732187-prlOnbKIBqHRoSXNRIw5F9ZtVarJkpfXXK8UKOC',
    access_token_secret: 'l3qS4ryEWsz8zxPH78aBotoGBgDony2pv8aE8aGSEiWXt'
});

exports.paperLow = function(callback) {
    exports.T.post('statuses/update', {status: 'Paper Low!'}, function(err, reply) {
        callback(err, reply);
    });
};