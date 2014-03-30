var CargoBlock = Part.extend({
	classId: 'CargoBlock',

	init: function () {
		Part.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(38, 38, 38)";
			this.textureSvg = ige.client.svgs.cargo;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CargoBlock; }
