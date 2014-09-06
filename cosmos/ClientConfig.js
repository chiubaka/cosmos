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
		'./entities/ConstructionOverlay.js',

		/* Blocks */
		'./entities/Block.js',
		'./components/GridData.js',
		'./entities/SparseGrid.js',
		'./entities/BlockGridFixtureDebugContainer.js',
		'./entities/BlockGrid.js',
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
		'./entities/blocks/parts/BridgeBlock.js',

		/* Thrusters */
		'./entities/blocks/parts/ThrusterBlock.js',
		'./entities/blocks/parts/thrusters/IronThrusterBlock.js',
		'./entities/blocks/parts/thrusters/SteelThrusterBlock.js',
		'./entities/blocks/parts/thrusters/KryptoniteThrusterBlock.js',


		/* Weapons */
		'./entities/blocks/parts/Weapon.js',
		'./entities/blocks/parts/weapons/Laser.js',
		'./entities/blocks/parts/weapons/lasers/RedLaserBlock.js',
		'./entities/blocks/parts/weapons/lasers/GreenLaserBlock.js',
		'./entities/blocks/parts/weapons/lasers/PurpleLaserBlock.js',

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

		/* Resource blocks */
		'./entities/blocks/Resource.js',
		'./entities/blocks/resources/IronBlock.js',
		'./entities/blocks/resources/CarbonBlock.js',
		'./entities/blocks/resources/FluorineBlock.js',
		'./entities/blocks/resources/CobaltBlock.js',
		'./entities/blocks/resources/GoldBlock.js',
		'./entities/blocks/resources/IceBlock.js',//not really an element
		'./entities/blocks/resources/MythrilBlock.js',
		'./entities/blocks/resources/RefinedMythrilBlock.js',

		'./entities/blocks/resources/AdamantiumBlock.js',
		'./entities/blocks/resources/DragonBlock.js',
		'./entities/blocks/resources/KryptoniteBlock.js',
		'./entities/blocks/resources/SteelBlock.js',
		'./entities/blocks/resources/TitaniumBlock.js',

		'./entities/blocks/Element.js',

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
		'./components/config/DamageSources.js',
		'./components/config/Descriptions.js',
		'./components/config/Elements.js',
		'./components/config/GridDimensions.js',
		'./components/config/Healths.js',
		'./components/config/Recipes.js',
		'./components/config/Thrusts.js',
		'./components/config/Types.js',

		/* === COMPONENTS === */
		'./components/Cargo.js',
		'./components/DamageSource.js',
		'./components/Description.js',
		'./components/Type.js',
		'./components/Health.js',
		'./components/Recipe.js',
		'./components/Thrust.js',
		'./components/ConstructionOverlayRenderableComponent.js',
		'./components/HealthBarRenderableComponent.js',
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
		'./ui/CargoUI.js',
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
		'./utils/MathUtils.js',
		'./utils/NetworkUtils.js',
		'./utils/RandomInterval.js',
		'./utils/PrototypeMixins.js',
		'./utils/MathUtils.js',

		/* === GAME SETUP === */
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
