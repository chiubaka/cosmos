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

	init: function(data) {
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.thruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ThrusterBlock; }
