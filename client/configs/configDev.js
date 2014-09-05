var config = {
	// IGE configuration paths
	igeRoot: './',
	gameRoot: './',
	gameJs: '/js/cosmos/game.js',

	// Game server URL. This gets injected into the cosmos.jade file
	gameServerUrl: 'http://dev.srv.cosmos.teamleonine.com:443',

	// Node.js express server
	expressServerPort: 2001, // Port 80 will be redirected to 2001 via iptables
	expressServerUrl: 'http://dev.cosmos.teamleonine.com',
	// Where to serve ige/ and cosmos/ from
	igeDirectory: '.',
	cosmosDirectory: '.',

	// Authentication
	microsoftClientId: '000000004C11BAB2',
	microsoftClientSecret: 'I5Mts54jjXJcvVCjmSZbLFhFYyJeoOAq',

	facebookAppId: '1510324745855541',
	facebookAppSecret: '2b9e9ad392bf334b4dfe52b70bc956f4',
};

module.exports = config;
