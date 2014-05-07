var igeClientConfig = {
	include: [
		/* === ENVIRONMENT STATE === */
		/* Blocks */
		'./entities/Block.js',
		'./entities/BlockGrid.js',
		'./entities/RenderContainer.js',

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

		/* Click scene (captures background client's background clicks) */
		'./entities/ClickScene.js',

		/* === PLAYER STATE === */
		'./entities/player/Player.js',
		'./models/state/ClientState.js',

		/* === USER INTERFACE === */
		/* HUD */
		'./ui/HUDManager.js',

		/* Capbar */
		'./ui/capbar/CapBar.js',
		'./ui/capbar/CapLabel.js',

		/* Capabilities */
		'./ui/capbar/caps/Cap.js',
		'./ui/capbar/caps/MineCap.js',
		'./ui/capbar/caps/ConstructCap.js',

		/* Toolbars */
		'./ui/toolbar/Toolbar.js',
		'./ui/toolbar/CargoToolbar.js',
		'./ui/toolbar/tools/Tool.js',
		'./ui/toolbar/tools/CargoTool.js',

		/* === SUPPLEMENTAL FUNCTIONALITY === */
		/* Debugging */
		'./debug/FixtureDebuggingEntity.js',

		/* Helper utilities */
		'./utils/DeploymentUtils.js',
		'./utils/RandomInterval.js',

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
