/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	argv = require('minimist')(process.argv.slice(2));
	path = require('path'),
	passport = require('passport'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session)
	MicrosoftStrategy = require('passport-windowslive').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	FacebookStrategy = require('passport-facebook').Strategy;

// Parse commmand line options
if (argv['local']) {
	global.config = require('./configs/configLocal');
}
else if (argv['dev']) {
	global.config = require('./configs/configDev');
}
else if (argv['preview']) {
	global.config = require('./configs/configPreview');
}
else {
	console.log('No configuration specified, defaulting to local no compile ' +
		'configuration.');
	console.log('Available configurations are: --local --dev --preview');
	global.config = require('./configs/configLocalNoCompile');
}

// Microsoft
var MICROSOFT_SCOPE = ['wl.signin', 'wl.basic', 'wl.emails'];
var MICROSOFT_AUTH_ROUTE = "/auth/msft";
var MICROSOFT_CALLBACK = MICROSOFT_AUTH_ROUTE + "/callback";

// Facebook
var FACEBOOK_AUTH_ROUTE = "/auth/fb";
var FACEBOOK_CALLBACK = FACEBOOK_AUTH_ROUTE + "/callback";

// Google
var GOOGLE_CLIENT_ID = "1055686652049-kph26b01itelhuqhhd3ekb2sum79a320.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "cBDD90FxmHn4NkANKvXxnIUk";
var GOOGLE_SCOPE = ['https://www.googleapis.com/auth/userinfo.profile',
									  'https://www.googleapis.com/auth/userinfo.email'];
var GOOGLE_AUTH_ROUTE = "/auth/google"
var GOOGLE_CALLBACK = GOOGLE_AUTH_ROUTE + "/callback";

// Redirect to this URL when authentication is successful.
var SUCCESS_REDIRECT_PATH = "/cosmos";

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

/**
 * Use the Microsoft account login strategy
 */
passport.use(new MicrosoftStrategy({
		clientID: global.config.microsoftClientId,
		clientSecret: global.config.microsoftClientSecret,
		callbackURL: global.config.expressServerUrl + MICROSOFT_CALLBACK
	},
	function (accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {

			// To keep the example simple, the user's Windows Live profile is returned
			// to represent the logged-in user.  In a typical application, you would
			// want to associate the Windows Live account with a user record in your
			// database, and return that user instead.
			profile.provider = "Microsoft";
			return done(null, profile);
		});
	}
));

passport.use(new FacebookStrategy({
		clientID: global.config.facebookAppId,
		clientSecret: global.config.facebookAppSecret,
		callbackURL: global.config.expressServerUrl + FACEBOOK_CALLBACK
	},
	function (accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {

			// To keep the example simple, the user's Facebook profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the Facebook account with a user record in your database,
			// and return that user instead.
			profile.provider = "Facebook";
			return done(null, profile);
		});
	}
));

passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: global.config.expressServerUrl + GOOGLE_CALLBACK
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			// To keep the example simple, the user's Google profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the Google account with a user record in your database,
			// and return that user instead.
			profile.provider = "Google";
			return done(null, profile);
		});
	}
));

var app = express();

app.configure(function () {
	app.set('port', global.config.expressServerPort);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({
		store: new MongoStore({
			url: 'mongodb://cosmos-admin:CS210-l3on1ne!@ds030827.mongolab.com:30827/cosmos-dev-db'
		}),
		secret: "pleaseworkpleaseworkpleasework",
		cookie: {
			// 5 days
			maxAge: 432000000,
			// TODO: httpOnly disabled may expose us to XSS attacks since JavaScript
			// embedded in the page will be able to read the JavaScript cookie. This is
			// only a problem if malicious JavaScript is allowed to run on the page, and
			// then the only thing that is stolen is the user's session.
			// Realistically, right now we need to be able to access the cookie via
			// JavaScript so that IGE can read the session ID and send it along when the
			// websocket connection opens.
			httpOnly: false,
		}
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true,
	}));
	app.use('/ige', express.static(global.config.igeDirectory));
	app.use('/cosmos', express.static(global.config.cosmosDirectory));
});

app.get('/', routes.index);
app.get('/account', ensureAuthenticated, routes.account);
app.get('/login', routes.login);
app.get('/cosmos', routes.cosmos);

/**
 * Microsoft Account authentication
 */
app.get(MICROSOFT_AUTH_ROUTE,
  passport.authenticate('windowslive', { scope: MICROSOFT_SCOPE }),
  function(req, res){
    // The request will be redirected to Windows Live for authentication, so
    // this function will not be called.
  });

app.get(MICROSOFT_CALLBACK,
	passport.authenticate('windowslive', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		console.log("logged in");
		res.redirect(SUCCESS_REDIRECT_PATH);
	}
);

/**
 * Facebook authentication
 */
app.get(FACEBOOK_AUTH_ROUTE,
	passport.authenticate('facebook'),
	function(req, res){
    	// The request will be redirected to Facebook for authentication, so this
		// function will not be called.
	}
);

app.get(FACEBOOK_CALLBACK,
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect(SUCCESS_REDIRECT_PATH);
	}
);

/**
 * Google Account authentication
 */
app.get(GOOGLE_AUTH_ROUTE,
  passport.authenticate('google', { scope: GOOGLE_SCOPE }));

app.get(GOOGLE_CALLBACK,
	passport.authenticate('google', { failureRedirect: '/login' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect(SUCCESS_REDIRECT_PATH);
	}
);

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
