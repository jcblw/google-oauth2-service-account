process.env.TZ = 'UTC';
const request = require('request');
const crypto = require('crypto');

var auth = function(key, options, callback) {

    var jwtHeaderB64,
        iat,
        exp,
        jwtClaim,
        jwtClaimB64,
        signatureInput,
        JWT,
        signature,
        jwtHeader;

    if ( typeof options === 'function' ) {
        callback = options;
        options = {};
    }

    options.expires = options.expires || 3600; // in seconds
    options.iss = options.iss || 'yourProjectID@developer.gserviceaccount.com';
    options.scope = options.scope || "https://www.googleapis.com/auth/calendar";
    options.aud = options.aud || "https://accounts.google.com/o/oauth2/token";

    jwtHeader = {
        alg: "RS256",
        typ: "JWT"
    };
    jwtHeaderB64 = base64urlEncode(JSON.stringify(jwtHeader));
    iat = Math.floor(new Date().getTime() / 1000);
    exp = iat + options.expires;

    jwtClaim = {
        iss : options.iss,
        scope : options.scope,
        aud : options.aud
    };
    jwtClaim.exp = exp;
    jwtClaim.iat = iat;
    jwtClaimB64 = base64urlEncode(JSON.stringify(jwtClaim));
    signatureInput = jwtHeaderB64 + '.' + jwtClaimB64;
    signature = sign(signatureInput, key);


    if ( typeof signature === 'object' ) {
        return callback ( new Error(signature.error) );
    }

    JWT = signatureInput + '.' + signature;
    request.post({
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: JWT
        }
    }, function(err, res, body) {
        var ret;
        if (err) return callback( err );
        if (res.statusCode !== 200) {
            return callback(new Error("failed to retrieve an access token"), body);
        }
        try {
            ret = JSON.parse(body)
        } catch ( e ) {
            return callback( e, body );
        }

        callback(err, ret.access_token);
    });

}

function sign(inStr, key) {
    var verifier,
        sig;

    if(key.length==0) return { error : "Invalid key form" };
    sig = crypto.createSign('RSA-SHA256').update(inStr).sign(key, 'base64');


    return base64urlEscape(sig);
}

function base64urlEncode(str) {
    return base64urlEscape(new Buffer(str).toString('base64'));
}

function base64urlEscape(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

module.exports.auth = auth;