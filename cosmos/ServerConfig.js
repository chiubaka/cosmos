var config = {
	include: [
		/* Our custom game JS scripts */
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'GameInit', path: './gameClasses/GameInit'},

		/* Our custom classes */
		{name: 'Block', path: './gameClasses/Block'},
		{name: 'BlockGrid', path: './gameClasses/BlockGrid'},

		/* Parts */
		{name: 'Part', path: './gameClasses/blocks/Part'},
		//-----------
		{name: 'PowerBlock', path: './gameClasses/blocks/parts/PowerBlock'},
		{name: 'EngineBlock', path: './gameClasses/blocks/parts/EngineBlock'},
		{name: 'FuelBlock', path: './gameClasses/blocks/parts/FuelBlock'},
		{name: 'CargoBlock', path: './gameClasses/blocks/parts/CargoBlock'},
		{name: 'ControlBlock', path: './gameClasses/blocks/parts/ControlBlock'},
		{name: 'MiningLaserBlock', path: './gameClasses/blocks/parts/MiningLaserBlock'},
		{name: 'ThrusterBlock', path: './gameClasses/blocks/parts/ThrusterBlock'},

		/* Elements */
		{name: 'Element', path: './gameClasses/blocks/Element'},
		//-------------
		{name: 'CarbonBlock', path: './gameClasses/blocks/elements/CarbonBlock'},
		{name: 'IronBlock', path: './gameClasses/blocks/elements/IronBlock'},
		{name: 'IceBlock', path:'./gameClasses/blocks/elements/IceBlock'},

		/* Other classes */
		{name: 'Player', path: './gameClasses/Player'},
		{name: 'Background', path: './gameClasses/Background'},
		{name: 'ExampleShips', path: './gameClasses/ExampleShips'},
		{name: 'AsteroidGenerator', path: './gameClasses/AsteroidGenerator'},

		{name: 'LaserBeam', path: './gameClasses/LaserBeam'},

		/* Debugging */
		{name: 'FixtureDebuggingEntity', path: './gameClasses/debug/FixtureDebuggingEntity'},

		/* Libraries used */
		{name: 'WeightedSelection', path: './lib/weighted'},
		{name: 'UuidGenerator', path: './lib/UuidGenerator'},

		/* Utils */
		{name: 'RandomInterval', path: './utils/RandomInterval'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
