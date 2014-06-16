var igeClientConfig = {
	include: [
		/* === ENVIRONMENT STATE === */

		/* Render container for block grids and overlays */
		'./entities/RenderContainer.js',

		/* Construction zone overlay */
		'./entities/ConstructionZoneOverlay.js',

		/* Blocks */
		'./entities/Block.js',
		'./entities/BlockGrid.js',
		'./entities/blocks/ConstructionZoneBlock.js',

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
		'./entities/blocks/elements/FluorineBlock.js',
		'./entities/blocks/elements/CobaltBlock.js',
		'./entities/blocks/elements/GoldBlock.js',
		'./entities/blocks/elements/IceBlock.js',//not really an element

		/* Effects */
		'./entities/effects/mining/LaserBeam.js',
		'./entities/effects/mining/LaserParticle.js',
		'./entities/effects/EngineParticle.js',
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

		/* Capabilities */
		'./models/capabilities/Capability.js',
		'./models/capabilities/ConstructCapability.js',
		'./models/capabilities/MineCapability.js',

		/* Notifications */
		'./notifications/NotificationDefinitions.js',
		'./notifications/NotificationUI.js',

		/* === USER INTERFACE === */
		/* HUD */
		'./ui/HUDManager.js',
		
		/* Stats */
		'./ui/info/GPSLabel.js',

		/* Debugging actions*/
		'./ui/debug/RelocateButton.js',
		'./ui/debug/NewShipButton.js',

		/* Capbar */
		'./ui/capbar/CapBar.js',
		'./ui/capbar/CapLabel.js',

		/* Caps */
		'./ui/capbar/caps/Cap.js',
		'./ui/capbar/caps/MineCap.js',
		'./ui/capbar/caps/ConstructCap.js',

		/* Toolbars */
		'./ui/toolbar/ToolBar.js',
		'./ui/toolbar/CargoToolbar.js',
		'./ui/toolbar/tools/Tool.js',
		'./ui/toolbar/tools/CargoTool.js',

		/* === SUPPLEMENTAL FUNCTIONALITY === */
		/* Debugging */
		'./debug/FixtureDebuggingEntity.js',

		/* Helper utilities */
		'./utils/BlockGridPadding.js',
		'./utils/DeploymentUtils.js',
		'./utils/MetricsHandler.js',
		'./utils/NetworkUtils.js',
		'./utils/RandomInterval.js',
		'./utils/PrototypeMixins.js',

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
