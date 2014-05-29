/**
 * A part is a block that players can use to improve their ship.
 */
var Part = Block.extend({
	classId: 'Part',

	init: function () {
		Block.prototype.init.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Part; }
