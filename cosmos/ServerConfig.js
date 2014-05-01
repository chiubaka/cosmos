var config = {
	include: [
		/* === GAME SETUP === */
		/* Initialization */
		{ name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents' },
		{ name: 'GameInit', path: './gameClasses/GameInit' },

		/* Configuration */

		/* === ENVIRONMENT STATE === */
		/* Blocks */
		{ name: 'Block', path: './gameClasses/Block' },
		{ name: 'BlockGrid', path: './gameClasses/BlockGrid' },

		/* Ship part blocks */
		{ name: 'Part', path: './gameClasses/blocks/Part' },
		{ name: 'PowerBlock', path: './gameClasses/blocks/parts/PowerBlock' },
		{ name: 'EngineBlock', path: './gameClasses/blocks/parts/EngineBlock' },
		{ name: 'FuelBlock', path: './gameClasses/blocks/parts/FuelBlock' },
		{ name: 'CargoBlock', path: './gameClasses/blocks/parts/CargoBlock' },
		{ name: 'ControlBlock', path: './gameClasses/blocks/parts/ControlBlock' },
		{ name: 'MiningLaserBlock', path: './gameClasses/blocks/parts/MiningLaserBlock' },
		{ name: 'ThrusterBlock', path: './gameClasses/blocks/parts/ThrusterBlock' },

		/* Element blocks */
		{ name: 'Element', path: './gameClasses/blocks/Element' },
		{ name: 'CarbonBlock', path: './gameClasses/blocks/elements/CarbonBlock' },
		{ name: 'IronBlock', path: './gameClasses/blocks/elements/IronBlock' },
		{ name: 'IceBlock', path: './gameClasses/blocks/elements/IceBlock' },

		/* Effects */
		{name: 'LaserBeam', path: './gameClasses/mining/LaserBeam'},
		{name: 'EffectsMount', path: './gameClasses/mining/EffectsMount'},

		/* Structures */
		{ name: 'ExampleShips', path: './gameClasses/ExampleShips' },

		/* Environment scenery */
		{ name: 'Background', path: './gameClasses/Background' },
		{ name: 'AsteroidGenerator', path: './gameClasses/AsteroidGenerator' },

		/* === PLAYER STATE === */
		{ name: 'Player', path: './gameClasses/Player' },

		/* Cargo */
		{ name: 'Cargo', path: './models/cargo/Cargo' },
		{ name: 'CargoContainer', path: './models/cargo/CargoContainer' },
		{ name: 'CargoItem', path: './models/cargo/CargoItem' },

		/* === SUPPLEMENTAL FUNCTIONALITY=== */
		/* Debugging */
		{ name: 'FixtureDebuggingEntity', path: './gameClasses/debug/FixtureDebuggingEntity' },

		/* Helper Utilities */
		{ name: 'PrototypeMixins', path: './utils/PrototypeMixins' },
		{ name: 'RandomInterval', path: './utils/RandomInterval' },

		/* === EXTERNAL LIBRARIES === */
		{ name: 'WeightedSelection', path: './lib/weighted' },
		{ name: 'UuidGenerator', path: './lib/UuidGenerator' }
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
