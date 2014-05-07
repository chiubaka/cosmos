var igeClientConfig = {
	include: [
		/* === ENVIRONMENT STATE === */
		/* Blocks */
		'./entities/Block.js',
		'./entities/BlockGrid.js',
		'./entities/RenderContainer.js',

		/* Parts */
		/* Ship part blocks */
		'./entities/blocks/Part.js',
		'./entities/blocks/parts/EngineBlock.js',
		'./entities/blocks/parts/PowerBlock.js',
		'./entities/blocks/parts/FuelBlock.js',
		'./entities/blocks/parts/CargoBlock.js',
		'./entities/blocks/parts/ControlBlock.js',
		'./entities/blocks/parts/MiningLaserBlock.js',
		'./entities/blocks/parts/ThrusterBlock.js',

		/* Element blocks */
		'./entities/blocks/Element.js',
		//--------------
		'./entities/blocks/elements/IronBlock.js',
		'./entities/blocks/elements/CarbonBlock.js',
		'./entities/blocks/elements/IceBlock.js',

		/* Effects */
		'./entities/effects/mining/LaserBeam.js',
		'./entities/effects/mining/EffectsMount.js',
		'./entities/effects/mining/LaserParticle.js',
		'./entities/effects/mining/EngineParticle.js',
		'./entities/effects/mining/BlockParticleEmitter.js',

		/* Structures (prefabs) */
		'./entities/prefabs/ExampleShips.js',

		/* Scenery */
		'./entities/scenery/Background.js',

		/* Click scene */
		'./entities/ClickScene.js',

		/* === PLAYER STATE === */
		'./entities/player/Player.js',

		/* === SUPPLEMENTAL FUNCTIONALITY === */
		/* Debugging */
		'./debug/FixtureDebuggingEntity.js',

		/* Helper utilities */
		'./utils/DeploymentUtils.js',
		'./utils/RandomInterval.js',

		/* UI */
		'./gameClasses/ClickInterceptLayer.js',

		/* === GAME SETUP === */
		/* Configuration */
		'./config/DeploymentConfig.js',

		/* Initialization */
		'./init/GameInit.js',
		'./init/ClientNetworkEvents.js',
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
