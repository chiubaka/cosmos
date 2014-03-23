var config = {
	include: [
		/* Our custom game JS scripts */
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},


		/* Our custom classes */
		{name: 'Block', path: './gameClasses/Block'},
		{name: 'BlockGrid', path: './gameClasses/BlockGrid'},

		/* Blocks */
		{name: 'PowerBlock', path: './gameClasses/blocks/PowerBlock'},
		{name: 'EngineBlock', path: './gameClasses/blocks/EngineBlock'},
		{name: 'FuelBlock', path: './gameClasses/blocks/FuelBlock'},
		{name: 'CargoBlock', path: './gameClasses/blocks/CargoBlock'},
		{name: 'ControlBlock', path: './gameClasses/blocks/ControlBlock'},

		/* Other classes */
		{name: 'Player', path: './gameClasses/Player'},
		{name: 'Background', path: './gameClasses/Background'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
