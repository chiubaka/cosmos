var igeClientConfig = {
	include: [
		/* Our custom game JS scripts */
			'./gameClasses/ClientNetworkEvents.js',
			'./gameClasses/Block.js',
			'./gameClasses/Player.js',
			'./gameClasses/Background.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
