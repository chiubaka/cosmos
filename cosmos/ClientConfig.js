var igeClientConfig = {
	include: [
		/* === CONSTANTS === */
		'./constants.js',

		/* === ENVIRONMENT STATE === */

		/* Render container for block grids and overlays */
		'./entities/RenderContainer.js',

		/* Construction zone overlay */
		'./entities/ConstructionZoneOverlay.js',

		/* Blocks */
		'./entities/Block.js',
		'./entities/BlockGrid.js',
		'./entities/BlockStructure.js',
		'./entities/blocks/ConstructionZoneBlock.js',
		'./entities/Drop.js',

		/* Ship part blocks */
		'./entities/blocks/Part.js',
		'./entities/blocks/parts/EngineBlock.js',
		'./entities/blocks/parts/PowerBlock.js',
		'./entities/blocks/parts/FuelBlock.js',
		'./entities/blocks/parts/CargoBlock.js',
		'./entities/blocks/parts/ControlBlock.js',
		'./entities/blocks/parts/MiningLaserBlock.js',
		'./entities/blocks/parts/ThrusterBlock.js',

		/* Ship armor blocks */
		'./entities/blocks/Armor.js',
		'./entities/blocks/armor/HullBlock.js',
		'./entities/blocks/armor/CloakBlock.js',
		'./entities/blocks/armor/CloakBlockLight.js',
		'./entities/blocks/armor/CloakBlockViolet.js',
		'./entities/blocks/armor/CloakBlockVioletLight.js',
		'./entities/blocks/armor/KryptoniteBlock.js',
		'./entities/blocks/armor/MithrilBlock.js',
		'./entities/blocks/armor/AdamantiumBlock.js',
		'./entities/blocks/armor/DragonBlock.js',
		'./entities/blocks/armor/TitaniumBlock.js',
		'./entities/blocks/armor/VioletBlock.js',
		'./entities/blocks/armor/OrangeBlock.js',

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
		'./entities/effects/GlowEffect.js',

		/* Structures (prefabs) */
		'./entities/prefabs/ExampleShips.js',

		/* Scenery */
		'./entities/scenery/ParallaxBackground.js',
		'./entities/scenery/Background.js',
		'./entities/scenery/StarfieldBackground.js',

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
		'./notifications/NotificationComponent.js',
		'./notifications/ui/NotificationUIComponent.js',

		/* === USER INTERFACE === */
		/* HUD */
		'./ui/HUDComponent.js',
		'./ui/BottomToolbarComponent.js',
		'./ui/ButtonComponent.js',
		'./ui/UserTileComponent.js',
		'./ui/ChatComponent.js',
		'./ui/MenuComponent.js',
		'./ui/FeedbackComponent.js',
		'./ui/NewShipComponent.js',
		'./ui/RelocateComponent.js',

		/* Minimap */
		'./ui/MinimapComponent.js',

		/* CapBar */
		'./ui/capbar/CapBar.js',

		/* Caps */
		'./ui/capbar/caps/Cap.js',
		'./ui/capbar/caps/MineCap.js',
		'./ui/capbar/caps/ConstructCap.js',

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
