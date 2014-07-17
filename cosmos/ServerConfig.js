var config = {
	include: [
		/* === CONSTANTS === */
		{ name: 'Constants', path: './constants' },

		/* === GAME SETUP === */
		/* Initialization */
		{ name: 'GameInit', path: './init/GameInit' },

		/* Network */
		{ name: 'ServerNetworkEvents', path: './ServerNetworkEvents' },

		/* === ENVIRONMENT STATE === */
		/* Blocks */
		{ name: 'Block', path: './entities/Block' },
		{ name: 'BlockGrid', path: './entities/BlockGrid' },
		{ name: 'BlockStructure', path: './entities/BlockStructure' },
		{ name: 'ConstructionZoneBlock', path: 'entities/blocks/ConstructionZoneBlock' },
		{ name: 'Drop', path: 'entities/Drop' },

		/* Ship part blocks */
		{ name: 'Part', path: './entities/blocks/Part' },
		{ name: 'PowerBlock', path: './entities/blocks/parts/PowerBlock' },
		{ name: 'EngineBlock', path: './entities/blocks/parts/EngineBlock' },
		{ name: 'IronEngineBlock', path: './entities/blocks/parts/engines/IronEngineBlock' },
		{ name: 'DragonBreathEngineBlock', path: './entities/blocks/parts/engines/DragonBreathEngineBlock' },
		{ name: 'FuelBlock', path: './entities/blocks/parts/FuelBlock' },
		{ name: 'CargoBlock', path: './entities/blocks/parts/CargoBlock' },
		{ name: 'ControlBlock', path: './entities/blocks/parts/ControlBlock' },
		{ name: 'ThrusterBlock', path: './entities/blocks/parts/ThrusterBlock' },
		{ name: 'IronThrusterBlock', path: './entities/blocks/parts/thrusters/IronThrusterBlock' },
		{ name: 'KryptoniteThrusterBlock', path: './entities/blocks/parts/thrusters/KryptoniteThrusterBlock' },

		/* Weapons */
		{ name: 'Weapon', path: './entities/blocks/parts/Weapon' },
		{ name: 'MiningLaserBlock', path: './entities/blocks/parts/weapons/MiningLaserBlock' },

		/* Ship armor blocks */
		{ name: 'Armor', path: './entities/blocks/parts/Armor' },
		{ name: 'HullBlock', path: './entities/blocks/parts/armor/HullBlock' },
		{ name: 'CloakBlock', path: './entities/blocks/parts/armor/CloakBlock' },
		{ name: 'CloakBlockLight', path: './entities/blocks/parts/armor/CloakBlockLight' },
		{ name: 'CloakBlockViolet', path: './entities/blocks/parts/armor/CloakBlockViolet' },
		{ name: 'CloakBlockVioletLight', path: './entities/blocks/parts/armor/CloakBlockVioletLight' },
		{ name: 'KryptoniteBlock', path: './entities/blocks/parts/armor/KryptoniteBlock' },
		{ name: 'MithrilBlock', path: './entities/blocks/parts/armor/MithrilBlock' },
		{ name: 'AdamantiumBlock', path: './entities/blocks/parts/armor/AdamantiumBlock' },
		{ name: 'DragonBlock', path: './entities/blocks/parts/armor/DragonBlock' },
		{ name: 'TitaniumBlock', path: './entities/blocks/parts/armor/TitaniumBlock' },
		{ name: 'VioletBlock', path: './entities/blocks/parts/armor/VioletBlock' },
		{ name: 'OrangeBlock', path: './entities/blocks/parts/armor/OrangeBlock' },

		/* Element blocks */
		{ name: 'Element', path: './entities/blocks/Element' },
		{ name: 'CarbonBlock', path: './entities/blocks/elements/CarbonBlock' },
		{ name: 'IronBlock', path: './entities/blocks/elements/IronBlock' },
		{ name: 'FluorineBlock', path: './entities/blocks/elements/FluorineBlock' },
		{ name: 'GoldBlock', path: './entities/blocks/elements/GoldBlock' },
		{ name: 'CobaltBlock', path: './entities/blocks/elements/CobaltBlock' },
		{ name: 'IceBlock', path: './entities/blocks/elements/IceBlock' },//not really an element

		/* Structures (Prefabs) */
		{ name: 'ExampleShips', path: './entities/prefabs/ExampleShips' },

		/* Scenery */
		{ name: 'ParallaxBackground', path: './entities/scenery/ParallaxBackground' },
		{ name: 'Background', path: './entities/scenery/Background' },
		{ name: 'BlockStructureGenerator', path: './entities/scenery/BlockStructureGenerator' },

		/* === COMPONENT CONFIG FILES === */
		{ name: 'Descriptions', path: './components/config/Descriptions' },
		{ name: 'Healths', path: './components/config/Healths' },
		{ name: 'Recipes', path: './components/config/Recipes' },
		{ name: 'Thrusts', path: './components/config/Thrusts' },

		/* === COMPONENTS === */
		{ name: 'DamageSource', path: './components/DamageSource' },
		{ name: 'Description', path: './components/Description'},
		{ name: 'Health', path: './components/Health' },
		{ name: 'Recipe', path: './components/Recipe' },
		{ name: 'Thrust', path: './components/Thrust' },

		/* === PLAYER STATE === */
		{ name: 'Player', path: './entities/player/Player' },

		/* Cargo */
		{ name: 'Cargo', path: './models/cargo/Cargo' },
		{ name: 'CargoContainer', path: './models/cargo/CargoContainer' },
		{ name: 'CargoItem', path: './models/cargo/CargoItem' },

		/* === Crafting === */
		{ name: 'CraftingSystem', path: './crafting/CraftingSystem' },
		{ name: 'CraftingComponent', path: './crafting/CraftingComponent' },

		/* === Quests === */
		{ name: 'QuestSystem', path: './quest/QuestSystem' },
		{ name: 'QuestComponent', path: './quest/QuestComponent' },
		{ name: 'Quest', path: './quest/Quest' },
		{ name: 'TutorialQuest', path: './quest/TutorialQuest' },


		/* Database */
		{ name: 'DbConfig', path: './db/DbConfig' },
		{ name: 'DbPlayer', path: './db/DbPlayer' },
		{ name: 'DbSession', path: './db/DbSession' },

		/* Notifications */
		{ name: 'NotificationComponent', path: './notifications/NotificationComponent'},
		{ name: 'NotificationDefinitions', path: './notifications/NotificationDefinitions'},

		/* === SUPPLEMENTAL FUNCTIONALITY=== */
		/* Debugging */
		{ name: 'FixtureDebuggingEntity', path: './debug/FixtureDebuggingEntity' },

		/* Helper Utilities */
		{ name: 'BlockGridPadding', path: './utils/BlockGridPadding' },
		{ name: 'NetworkUtils', path: './utils/NetworkUtils' },
		{ name: 'PrototypeMixins', path: './utils/PrototypeMixins' },
		{ name: 'RandomInterval', path: './utils/RandomInterval' },

		/* === EXTERNAL LIBRARIES === */
		{ name: 'WeightedSelection', path: './lib/weighted' },
		{ name: 'UuidGenerator', path: './lib/UuidGenerator' },
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
