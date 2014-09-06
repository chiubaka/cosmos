var config = {
	// IGE configuration paths
	igeRoot: '../ige/engine/',
	gameRoot: '../cosmos/',
	gameJs: '../ige/engine/loader.js',

	// Game server URL. This gets injected into the cosmos.jade file
	gameServerUrl: 'http://localhost:2000',

	// Node.js express server
	expressServerPort: 2001,
	expressServerUrl: 'http://tl-cosmos.localtest.me:2001',
	// Where to serve ige/ and cosmos/ from
	igeDirectory: '../ige',
	cosmosDirectory: '../cosmos',

	// Authentication
	microsoftClientId: '000000004011FE88',
	microsoftClientSecret: 'wpNliQi3hxndft-KdgzmAUrQABtJyD4r',

	facebookAppId: '1506916002863082',
	facebookAppSecret: 'adcf2894f7024a5d8afcce03201ce434',
};

module.exports = config;
