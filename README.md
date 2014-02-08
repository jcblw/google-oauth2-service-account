### Google Oauth2 for Service Accounts

this is a simple library that will allow you to use google oauth2 with service accounts. This means you can access you own data from a server without any pesky popups.

### Usage

```javascript
var key = readFileSync('./key.pem');
var account = require('google-auth2-service-account');

account.auth( key, { 
	iss : 'wqefwqefqwfe@developer.gserviceaccount.com',
	scope : 'https://www.googleapis.com/auth/calendar'
}, function ( err, accessToken ) {
	// yeah if we have access token
});
```
