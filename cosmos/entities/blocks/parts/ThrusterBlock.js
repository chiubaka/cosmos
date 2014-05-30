var ThrusterBlock = Part.extend({
	classId: 'ThrusterBlock',

	MAX_HP: 50,

	init: function () {
		data = {maxHp: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.svgs.thruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ThrusterBlock; }
