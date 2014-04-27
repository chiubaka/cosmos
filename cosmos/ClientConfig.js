var igeClientConfig = {
	include: [
		/* Configuration */
		'./config/DeploymentConfig.js',


		/* Our custom game JS scripts */
		'./gameClasses/Block.js',
		'./gameClasses/BlockGrid.js',

		'./gameClasses/GameInit.js',
		'./gameClasses/ClientNetworkEvents.js',

		'./gameClasses/Player.js',
		'./gameClasses/Background.js',
		'./gameClasses/ExampleShips.js',

		/* Parts */
		'./gameClasses/blocks/Part.js',
		//-------------
		'./gameClasses/blocks/parts/EngineBlock.js',
		'./gameClasses/blocks/parts/PowerBlock.js',
		'./gameClasses/blocks/parts/FuelBlock.js',
		'./gameClasses/blocks/parts/CargoBlock.js',
		'./gameClasses/blocks/parts/ControlBlock.js',
		'./gameClasses/blocks/parts/MiningLaserBlock.js',
		'./gameClasses/blocks/parts/ThrusterBlock.js',

		/* Elements */
		'./gameClasses/blocks/Element.js',
		//--------------
		'./gameClasses/blocks/elements/IronBlock.js',
		'./gameClasses/blocks/elements/CarbonBlock.js',
		'./gameClasses/blocks/elements/IceBlock.js',

		'./gameClasses/LaserBeam.js',

		/* Debugging */
		'./gameClasses/debug/FixtureDebuggingEntity.js',

		/* Standard game scripts */
		'./client.js',
		'./index.js',

		/* Utility scripts*/
		'./utils/DeploymentUtils.js',
		'./utils/RandomInterval.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
