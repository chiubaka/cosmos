/**
 * Subclass of the {@link Block} class. The Element class is an abstract super class for {@link Block}s that serve as
 * raw resources that players will craft into {@link Part}s.
 * Elements are found (1) on asteroids and (2) floating around in space.
 * @class
 * @typedef {Element}
 * @namespace
 */
var Element = Block.extend({
	classId: 'Element',

	init: function (data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Element; }
