var Armor = Block.extend({
	classId: 'Armor',

	init: function (data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Armor; }
