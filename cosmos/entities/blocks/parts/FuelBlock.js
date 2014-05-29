/**
 * Fuel blocks provide fuel for the engines.
 * TODO engines should actually consume fuel blocks or something. Right now fuel blocks don't do anything.
 */
var FuelBlock = Part.extend({
	classId: 'FuelBlock',

	init: function () {
		Part.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(0, 211, 10)";
			this.textureSvg = ige.client.svgs.fuel;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FuelBlock; }
