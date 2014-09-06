var config = {
	// IGE configuration paths
	igeRoot: './',
	gameRoot: './',
	gameJs: '/js/cosmos/game.js',

	// Game server URL. This gets injected into the cosmos.jade file
	gameServerUrl: 'http://preview.srv.cosmos.teamleonine.com:443',

	// Node.js express server
	expressServerPort: 2001, // Port 80 will be redirected to 2001 via iptables
	expressServerUrl: 'http://preview.cosmos.teamleonine.com',
	// Where to serve ige/ and cosmos/ from
	igeDirectory: '.',
	cosmosDirectory: '.',

	// Authentication
	microsoftClientId: '000000004C11C46D',
	microsoftClientSecret: '7gLCN5eNz0xvOGtDyLJSXAedQmp-C9XO',

	facebookAppId: '1506885042866178',
	facebookAppSecret: 'a659dfec5c98fc5e0f1941da279d1202',
};

module.exports = config;
