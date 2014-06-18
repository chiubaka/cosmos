// TODO: Add msg for empty cargo + construct
// TODO: Add msg for missing engines/lasers

var NotificationDefinitions = {
	infoKeys: {
		test: 1,
	},

	infos: {
		1: 'Test Message!',
	},

	errorKeys: {
		notMinable: 1,
		notConstructable: 2,
		noCapability: 3,
		noItemTypeSelected: 4,
		noMineEmptySpace: 5,
	},

	errors: {
		1: 'Cannot mine this block!',
		2: 'Cannot construct here!',
		3: 'No capability selected!',
		4: 'No block type selected!',
		5: 'Cannot mine empty space!',
	},

	successKeys: {
		constructNewBlock: 1,
		minedBlock: 2,
	},

	successes: {
		1: 'Constructed new block!',
		2: 'Mined a block!',
	}


};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NotificationDefinitions; }
