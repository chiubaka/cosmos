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
    {name: 'PlayerControlBlock', path: './gameClasses/blocks/PlayerControlBlock'},

		/* Other classes */
		{name: 'Player', path: './gameClasses/Player'},
		{name: 'Background', path: './gameClasses/Background'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
