var Armor = Part.extend({
	classId: 'Armor',

	DESCRIPTION: 'An armor block. Useful for protecting important parts of your ship, but doesn\'t do anything ' +
		'special.',

	init: function (data) {
		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Armor; }
