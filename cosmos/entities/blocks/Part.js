/**
 * A part is a block that players can use to improve their ship.
 */
var Part = Block.extend({
	classId: 'Part',

	init: function(data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Part; }
