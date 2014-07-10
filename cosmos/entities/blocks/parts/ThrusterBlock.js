/**
 * Subclass of the {@link Part} class. ThrusterBlocks allow your ship to rotate.
 * They don't provide primary thrust, they just provide the little impulses necessary to rotate your ship.
 * The more thrusters you have the more agile your ship will be.
 * @class
 * @typedef {ThrusterBlock}
 * @namespace
 */
var ThrusterBlock = Part.extend({
	classId: 'ThrusterBlock',

	/**
	 * The maximum HP for a {@link ThrusterBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof ThrusterBlock
	 * @instance
	 */
	MAX_HP: 40,

	DESCRIPTION: 'Thrusters allow your ship to rotate left and right. The more thrusters your ship has, the faster ' +
		'it can rotate. If you have no thrusters, your ship cannot rotate. As you place more blocks on your ship, ' +
		'your ship will become heavier and you will need more thrusters in order to rotate at the same speed as ' +
		'before.',

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.thruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ThrusterBlock; }
