/**
 * Contains all notification definitions.
 * The text of notifications are centralized so they are easy to view
 * and change. In addition, the use of definitions saves bandwidth
 * because the server sends a number instead of the full string.
 * @namespace
 */
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
		noItemTypeSelected: 4,
		noMineEmptySpace: 5,
		noEngine: 6,
		noRotationalThruster: 7,
		noMiningLaser: 8,
	},

	errors: {
		1: 'Cannot mine this block... mining laser cannot reach!',
		2: 'Cannot construct here!',
		4: 'No block type selected!',
		5: 'Cannot mine empty space!',
		6: 'Cannot thrust... no engine!',
		7: 'Cannot rotate... no rotational thruster!',
		8: 'Cannot mine... no mining laser!',
	},

	successKeys: {
		constructNewBlock: 1,
		minedBlock: 2,
		relocateShip: 3,
		newShip: 4,
	},

	successes: {
		1: 'Constructed new block!',
		2: 'Mined a block!',
		3: 'Relocated ship!',
		4: 'New ship created and relocated!',
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NotificationDefinitions; }
