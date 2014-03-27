var igeClientConfig = {
	include: [
		/* Our custom game JS scripts */
		'./gameClasses/Block.js',
		'./gameClasses/BlockGrid.js',

		'./gameClasses/GameInit.js',
		'./gameClasses/ClientNetworkEvents.js',

		'./gameClasses/Player.js',
		'./gameClasses/Background.js',
		'./gameClasses/ExampleShips.js',

		/* Parts */
		'./gameClasses/blocks/part.js',
		//-------------
		'./gameClasses/blocks/parts/EngineBlock.js',
		'./gameClasses/blocks/parts/PowerBlock.js',
		'./gameClasses/blocks/parts/FuelBlock.js',
		'./gameClasses/blocks/parts/CargoBlock.js',
		'./gameClasses/blocks/parts/ControlBlock.js',
		'./gameClasses/blocks/parts/MiningLaserBlock.js',
		'./gameClasses/blocks/parts/ThrusterBlock.js',

		/* Elements */
		'./gameClasses/blocks/element.js',
		//--------------
		'./gameClasses/blocks/elements/Iron.js',
		'./gameClasses/blocks/elements/Carbon.js',

		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
