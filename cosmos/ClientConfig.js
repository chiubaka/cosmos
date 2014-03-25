var igeClientConfig = {
	include: [
		/* Our custom game JS scripts */
		'./gameClasses/Block.js',
		'./gameClasses/BlockGrid.js',

		'./gameClasses/ClientNetworkEvents.js',

		'./gameClasses/Player.js',
		'./gameClasses/Background.js',
		'./gameClasses/ExampleShips.js',

		/* Blocks */
		'./gameClasses/blocks/EngineBlock.js',
		'./gameClasses/blocks/PowerBlock.js',
		'./gameClasses/blocks/FuelBlock.js',
		'./gameClasses/blocks/CargoBlock.js',
		'./gameClasses/blocks/ControlBlock.js',
		'./gameClasses/blocks/MiningLaserBlock.js',
		'./gameClasses/blocks/ThrusterBlock.js',

		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
