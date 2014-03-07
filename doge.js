var dogecoin = require('node-dogecoin')()
var address,
    bal_old=0,
    delta = 0;

exports.init = function() {
    dogecoin.auth(app.get('username'),app.get('password')).set('host', 'localhost').set({port:22555})

    //retrieve the address or generate a new address
    dogecoin.getAddressesByAccount("toiletpaper", function(err, result) {
        if (err)
            return err;
        if (result.length != 0){
            if (result.length >1)
                console.log("Warning: more than one address exists. Balances may not be correct.");
            address = result[0];
        }
        else
            dogecoin.getNewAddress("toiletpaper", function(err, result) {
                if (err)
                    return err;
                address = result;
                console.log("address to broadcast: " + address);
            })
        console.log("address to broadcast: " + address);
    })
    getbalance(true); //get the initial balance
    setInterval(function(){getbalance(false,updatecredit)}, 15000);
}

//retrieve balance
getbalance = function(init, callback) {
    //retrieve balance
    dogecoin.getBalance("toiletpaper", function(err, result) {

    if (err)
        return err;

    //empty accounts have a composite object as balance.
    if (typeof result === 'number')
        result = result.result;

    if (init)
        bal_old = result;
    else {
        delta = result - bal_old;
        bal_old = result;
    }
    return callback;
    })
}

updatecredit = function() {
    if (delta > 0){
        var add_sheets = delta;
        //meow meow add more sheets
    }
}