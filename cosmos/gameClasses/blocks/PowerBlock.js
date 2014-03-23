var PowerBlock = Block.extend({
	classId: 'PowerBlock',

	init: function () {
		Block.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(255, 190, 13)";
			this.textureSvg = ige.client.svgs.power;
			this.textureSvgUrl = "./assets/blocks/power/power.svg";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PowerBlock; }
