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
		crafting_recipeNotUnlocked : 9,
		crafting_insufficientReactants: 10,
		crafting_insufficientEquipment: 11,
		crafting_insufficientCargoSpace: 12,
		alreadyLoggedIn: 13
	},

	errors: {
		1: 'Cannot mine this block. Your mining laser cannot reach the inside of asteroids.',
		2: 'Cannot construct here!',
		4: 'No block type selected!',
		5: 'Cannot mine empty space!',
		6: 'Cannot thrust... no engine!',
		7: 'Cannot rotate... no rotational thruster!',
		8: 'Cannot mine... no mining laser!',
		9: 'Recipe not unlocked!',
		10: 'Insufficient reactants!',
		11: 'Insufficient ship equipment!',
		12: 'Insufficient cargo space!',
		13: 'This account is already playing the game elsewhere!'
	},

	successKeys: {
		constructNewBlock: 1,
		minedBlock: 2,
		relocateShip: 3,
		newShip: 4,
		crafting_success: 5,
	},

	successes: {
		1: 'Constructed new block!',
		2: 'Mined a block!',
		3: 'Relocated ship!',
		4: 'New ship created and relocated!',
		5: 'Crafted a block!',
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NotificationDefinitions; }
