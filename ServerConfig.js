var config = {
	include: [
		/* Our custom game JS scripts */
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},


		/* Our custom classes */
		{name: 'Block', path: './gameClasses/Block'},
		{name: 'Player', path: './gameClasses/Player'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
