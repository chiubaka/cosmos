var igeClientConfig = {
	include: [
		/* === ENVIRONMENT STATE === */
		/* Blocks */
		'./gameClasses/Block.js',
		'./gameClasses/BlockGrid.js',
		'./gameClasses/RenderContainer.js',

		/* Parts */
		/* Ship part blocks */
		'./gameClasses/blocks/Part.js',
		//-------------
		'./gameClasses/blocks/parts/EngineBlock.js',
		'./gameClasses/blocks/parts/PowerBlock.js',
		'./gameClasses/blocks/parts/FuelBlock.js',
		'./gameClasses/blocks/parts/CargoBlock.js',
		'./gameClasses/blocks/parts/ControlBlock.js',
		'./gameClasses/blocks/parts/MiningLaserBlock.js',
		'./gameClasses/blocks/parts/ThrusterBlock.js',

		/* Element blocks */
		'./gameClasses/blocks/Element.js',
		//--------------
		'./gameClasses/blocks/elements/IronBlock.js',
		'./gameClasses/blocks/elements/CarbonBlock.js',
		'./gameClasses/blocks/elements/IceBlock.js',

		/* Effects */
		'./gameClasses/mining/LaserBeam.js',

		/* Structures */
		'./gameClasses/ExampleShips.js',

		/* Environment scenery */
		'./gameClasses/Background.js',

		/* === PLAYER STATE === */
		'./gameClasses/Player.js',

		/* === SUPPLEMENTAL FUNCTIONALITY === */
		/* Debugging */
		'./gameClasses/debug/FixtureDebuggingEntity.js',

		/* Helper utilities */
		'./utils/DeploymentUtils.js',
		'./utils/RandomInterval.js',

		/* === GAME SETUP === */
		/* Configuration */
		'./config/DeploymentConfig.js',

		/* Initialization */
		'./gameClasses/GameInit.js',
		'./gameClasses/ClientNetworkEvents.js',
		'./client.js',
		'./index.js',
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
