
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	passport = require('passport'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session)
	MicrosoftStrategy = require('passport-windowslive').Strategy,
	GoogleStrategy = require('passport-google').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy;

// Client secrets, etc
var MICROSOFT_CLIENT_ID = "000000004011FE88";
var MICROSOFT_CLIENT_SECRET = "wpNliQi3hxndft-KdgzmAUrQABtJyD4r";
var FACEBOOK_APP_ID = "1506916002863082";
var FACEBOOK_APP_SECRET = "adcf2894f7024a5d8afcce03201ce434";

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
		clientID: MICROSOFT_CLIENT_ID,
		clientSecret: MICROSOFT_CLIENT_SECRET,
		callbackURL: "http://teamleonine-chplus.localtest.me:3000/auth/msft/callback"
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
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "http://teamleonine-chplus.localtest.me:3000/auth/fb/callback"
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
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
	  profile.provider = "Google";
      return done(null, profile);
    });
  }
));

var app = express();

app.configure(function () {
	app.set('port', 3000);
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
		cookie: { maxAge: 432000000 /* 5 days */ }
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	console.log("Running in development mode.");
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true,
	}));
});

app.configure('production', function () {
	console.log("Running in production mode.");
});

app.get('/', routes.index);
app.get('/account', ensureAuthenticated, routes.account);
app.get('/login', routes.login);
app.get('/cosmos', routes.cosmos);

/**
 * Microsoft Account authentication
 */
app.get('/auth/msft',
  passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic', 'wl.emails'] }),
  function(req, res){
    // The request will be redirected to Windows Live for authentication, so
    // this function will not be called.
  });

app.get('/auth/msft/callback', passport.authenticate('windowslive', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		console.log("logged in");
		res.redirect('/');
	});

/**
 * Facebook authentication
 */
app.get('/auth/fb',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

app.get('/auth/fb/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

/**
 * Google Account authentication
 */
app.get('/auth/google',
  passport.authenticate('google'));

app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

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
