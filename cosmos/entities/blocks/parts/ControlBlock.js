var ControlBlock = Part.extend({
	classId: 'ControlBlock',

	MAX_HP: 70,

	init: function () {
		data = {maxHp: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(8, 143, 255)";
			this.textureSvg = ige.client.svgs.control;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ControlBlock; }
