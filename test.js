require('dotenv').load()

var account = require('./index');
var request = require('request');
var key = process.env.KEY;

const calRoot = "https://www.googleapis.com/calendar/v3";

account.auth( decodeURIComponent( key ), {
        iss : process.env.ISS
    }, function( err, accessToken ){

    if ( err ) throw( err );

    var token = "?access_token="+accessToken;

    request.get({
        url: calRoot + "/users/me/calendarList" + token,
        json:true
    }, function(err, res, body){

        for(var c=0; c<body.items.length; c++){
            console.log(body.items[c]);

            request.get({
                url:calRoot+"/calendars/"+body.items[c].id+"/events"+token,
                json:true
                }, function(err, res, cal){
                    console.log(cal);
            });
        }
    })
})