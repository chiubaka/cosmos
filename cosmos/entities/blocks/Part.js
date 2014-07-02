/**
 * Subclass of the {@link Block}. A Part is an abstract super class for all {@link Block} types that would be used on a
 * player's ship or man-made structures (e.g. {@link MiningLaserBlock}, {@link CargoBlock}, {@link EngineBlock}).
 * @class
 * @typedef {Part}
 * @namespace
 */
var Part = Block.extend({
	classId: 'Part',

	DESCRIPTION: 'A ship part block with no special properties (yet).',

	init: function(data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Part; }
