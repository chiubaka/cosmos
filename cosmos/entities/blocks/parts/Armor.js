var Armor = Part.extend({
	classId: 'Armor',

	init: function(data) {
		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Armor; }
