var config = {
	include: [
		/* === GAME SETUP === */
		/* Initialization */
		{ name: 'ServerNetworkEvents', path: './init/ServerNetworkEvents' },
		{ name: 'GameInit', path: './init/GameInit' },

		/* Configuration */

		/* === ENVIRONMENT STATE === */
		/* Blocks */
		{ name: 'Block', path: './entities/Block' },
		{ name: 'BlockGrid', path: './entities/BlockGrid' },

		/* Ship part blocks */
		{ name: 'Part', path: './entities/blocks/Part' },
		{ name: 'PowerBlock', path: './entities/blocks/parts/PowerBlock' },
		{ name: 'EngineBlock', path: './entities/blocks/parts/EngineBlock' },
		{ name: 'FuelBlock', path: './entities/blocks/parts/FuelBlock' },
		{ name: 'CargoBlock', path: './entities/blocks/parts/CargoBlock' },
		{ name: 'ControlBlock', path: './entities/blocks/parts/ControlBlock' },
		{ name: 'MiningLaserBlock', path: './entities/blocks/parts/MiningLaserBlock' },
		{ name: 'ThrusterBlock', path: './entities/blocks/parts/ThrusterBlock' },

		/* Element blocks */
		{ name: 'Element', path: './entities/blocks/Element' },
		{ name: 'CarbonBlock', path: './entities/blocks/elements/CarbonBlock' },
		{ name: 'IronBlock', path: './entities/blocks/elements/IronBlock' },
		{ name: 'IceBlock', path: './entities/blocks/elements/IceBlock' },

		/* Effects */
		{ name: 'LaserBeam', path: './entities/effects/mining/LaserBeam' },
		{name: 'EffectsMount', path: './entities/effects/mining/EffectsMount'},
		{name: 'LaserParticle', path: './entities/effects/mining/LaserParticle'},

		/* Structures (Prefabs) */
		{ name: 'ExampleShips', path: './entities/prefabs/ExampleShips' },

		/* Scenery */
		{ name: 'Background', path: './entities/scenery/Background' },
		{ name: 'AsteroidGenerator', path: './entities/scenery/AsteroidGenerator' },

		/* === PLAYER STATE === */
		{ name: 'Player', path: './entities/player/Player' },

		/* Cargo */
		{ name: 'Cargo', path: './models/cargo/Cargo' },
		{ name: 'CargoContainer', path: './models/cargo/CargoContainer' },
		{ name: 'CargoItem', path: './models/cargo/CargoItem' },

		/* === SUPPLEMENTAL FUNCTIONALITY=== */
		/* Debugging */
		{ name: 'FixtureDebuggingEntity', path: './debug/FixtureDebuggingEntity' },

		/* Helper Utilities */
		{ name: 'PrototypeMixins', path: './utils/PrototypeMixins' },
		{ name: 'RandomInterval', path: './utils/RandomInterval' },

		/* === EXTERNAL LIBRARIES === */
		{ name: 'WeightedSelection', path: './lib/weighted' },
		{ name: 'UuidGenerator', path: './lib/UuidGenerator' }
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
