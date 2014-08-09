var igeClientConfig = {
	include: [
		/* === CONSTANTS === */
		'./constants.js',

		/* === Systems === */
		'./systems/Inspector.js',

		/* === ENVIRONMENT STATE === */

		/* Render container for block grids and overlays */
		'./entities/RenderContainer.js',

		/* Construction zone overlay */
		'./entities/ConstructionZoneOverlay.js',

		/* Blocks */
		'./entities/Block.js',
		'./components/GridData.js',
		'./entities/SparseGrid.js',
		'./entities/BlockGridPhysicsContainer.js',
		'./entities/BlockGrid.js',
		'./entities/BlockGridNew.js',
		'./entities/BlockStructure.js',
		'./entities/GeneratedBlockStructure.js',
		'./entities/blocks/ConstructionZoneBlock.js',
		'./entities/Drop.js',

		/* Ship part blocks */
		'./entities/blocks/Part.js',

		/* Engines */
		'./entities/blocks/parts/EngineBlock.js',
		'./entities/blocks/parts/engines/IronEngineBlock.js',
		'./entities/blocks/parts/engines/SteelEngineBlock.js',
		'./entities/blocks/parts/engines/DragonBreathEngineBlock.js',

		/* Misc */
		'./entities/blocks/parts/PowerBlock.js',
		'./entities/blocks/parts/FuelBlock.js',
		'./entities/blocks/parts/CargoBlock.js',
		'./entities/blocks/parts/ControlBlock.js',

		/* Thrusters */
		'./entities/blocks/parts/ThrusterBlock.js',
		'./entities/blocks/parts/thrusters/IronThrusterBlock.js',
		'./entities/blocks/parts/thrusters/SteelThrusterBlock.js',
		'./entities/blocks/parts/thrusters/KryptoniteThrusterBlock.js',


		/* Weapons */
		'./entities/blocks/parts/Weapon.js',
		'./entities/blocks/parts/weapons/MiningLaserBlock.js',

		/* Ship armor blocks */
		'./entities/blocks/parts/Armor.js',
		'./entities/blocks/parts/armor/IronPlatingBlock.js',
		'./entities/blocks/parts/armor/CloakBlock.js',
		'./entities/blocks/parts/armor/CloakBlockLight.js',
		'./entities/blocks/parts/armor/CloakBlockViolet.js',
		'./entities/blocks/parts/armor/CloakBlockVioletLight.js',
		'./entities/blocks/parts/armor/KryptonitePlatingBlock.js',
		'./entities/blocks/parts/armor/AdamantiumPlatingBlock.js',
		'./entities/blocks/parts/armor/MythrilPlatingBlock.js',
		'./entities/blocks/parts/armor/DragonPlatingBlock.js',
		'./entities/blocks/parts/armor/TitaniumPlatingBlock.js',
		'./entities/blocks/parts/armor/SteelPlatingBlock.js',

		/* Element blocks */
		'./entities/blocks/Element.js',
		'./entities/blocks/elements/IronBlock.js',
		'./entities/blocks/elements/CarbonBlock.js',
		'./entities/blocks/elements/FluorineBlock.js',
		'./entities/blocks/elements/CobaltBlock.js',
		'./entities/blocks/elements/GoldBlock.js',
		'./entities/blocks/elements/IceBlock.js',//not really an element
		'./entities/blocks/elements/MythrilBlock.js',
		'./entities/blocks/elements/RefinedMythrilBlock.js',

		'./entities/blocks/elements/AdamantiumBlock.js',
		'./entities/blocks/elements/DragonBlock.js',
		'./entities/blocks/elements/KryptoniteBlock.js',
		'./entities/blocks/elements/SteelBlock.js',
		'./entities/blocks/elements/TitaniumBlock.js',


		/* Effects */
		'./entities/effects/mining/LaserBeam.js',
		'./entities/effects/mining/LaserParticle.js',
		'./entities/effects/EngineParticle.js',
		'./entities/effects/mining/BlockParticleEmitter.js',
		'./entities/effects/GlowEffect.js',
		'./entities/effects/HealthBar.js',

		/* Structures (prefabs) */
		'./entities/prefabs/ExampleShips.js',

		/* Scenery */
		'./entities/scenery/ParallaxBackground.js',
		'./entities/scenery/Background.js',
		'./entities/scenery/StarfieldBackground.js',

		/* Click scene (captures background client's background clicks) */
		'./entities/ClickScene.js',

		/* === COMPONENT CONFIG FILES === */
		'./components/config/Descriptions.js',
		'./components/config/Types.js',
		'./components/config/Healths.js',
		'./components/config/Recipes.js',
		'./components/config/Thrusts.js',

		/* === COMPONENTS === */
		'./components/DamageSource.js',
		'./components/Description.js',
		'./components/Type.js',
		'./components/Health.js',
		'./components/Recipe.js',
		'./components/Thrust.js',
		'./components/ParallaxBackgroundRenderableComponent.js',
		'./components/LaserBeamRenderableComponent.js',
		'./components/ParticleRenderableComponent.js',
		'./components/RespawnableComponent.js',

		/* === PLAYER STATE === */
		'./entities/player/Player.js',
		'./entities/ship/Ship.js',
		'./models/state/ClientState.js',

		/* Capabilities */
		'./models/capabilities/Capability.js',
		'./models/capabilities/ConstructCapability.js',
		'./models/capabilities/MineCapability.js',

		/* === Crafting === */
		'./crafting/CraftingSystem.js',
		'./crafting/CraftingComponent.js',

		/* === Quests === */
		'./quest/QuestSystem.js',
		'./quest/QuestComponent.js',
		'./quest/Quest.js',
		'./quest/TutorialQuest.js',

		/* Notifications */
		'./notifications/NotificationDefinitions.js',
		'./notifications/NotificationComponent.js',
		'./notifications/ui/NotificationUIComponent.js',

		/* === USER INTERFACE === */
		/* HUD */
		'./ui/HUDComponent.js',
		'./ui/BottomToolbarComponent.js',
		'./ui/LeftToolbarComponent.js',
		'./ui/WindowsComponent.js',
		'./ui/ButtonComponent.js',
		'./ui/WindowComponent.js',
		'./ui/UserTileComponent.js',
		'./ui/ChatComponent.js',
		'./ui/MenuComponent.js',
		'./ui/FeedbackComponent.js',
		'./ui/NewShipComponent.js',
		'./ui/RelocateComponent.js',
		'./ui/CargoComponent.js',
		'./ui/CraftingUIComponent.js',
		'./ui/NamePrompt.js',

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
		'./utils/NetworkUtils.js',
		'./utils/RandomInterval.js',
		'./utils/PrototypeMixins.js',

		/* === GAME SETUP === */
		/* Configuration */
		'./config/DeploymentConfig.js',

		/* Network */
		'./ClientNetworkEvents.js',

		/* Initialization */
		'./init/GameInit.js',
		'./client.js',
		'./index.js',

		/* Metrics */
		'./utils/MetricsHandler.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
