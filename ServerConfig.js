var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Block', path: './gameClasses/Block'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }