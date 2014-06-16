var NotificationDefinitions = {
	infoKeys: {
		test: 1,
	},

	infos: {
		1: 'Test Message!',
	},

	errorKeys: {
		not_minable: 1,
		not_constructable: 2,
	},

	errors: {
		1: 'Cannot mine this block!',
		2: 'Cannot construct here!',
	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NotificationDefinitions; }
