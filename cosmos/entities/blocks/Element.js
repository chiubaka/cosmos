/**
 * An element is a raw resource that players will craft into ship parts.
 * Elements are found (1) on asteroids and (2) floating around in space.
 */
var Element = Block.extend({
	classId: 'Element',

	init: function (data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Element; }
