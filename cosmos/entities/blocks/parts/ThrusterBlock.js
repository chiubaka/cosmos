/**
 * Thruster blocks allow your ship to rotate.
 * They don't provide primary thrust, they just provide the little impulses neccesary to rotate your ship.
 * The more thrusters you have the more agile your ship (and your startup) will be.
 * @class
 * @namespace
 */
var ThrusterBlock = Part.extend({
	classId: 'ThrusterBlock',

	MAX_HP: 40,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.svgs.thruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ThrusterBlock; }
