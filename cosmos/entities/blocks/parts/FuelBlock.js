/**
 * Fuel blocks provide fuel for the engines.
 * TODO engines should actually consume fuel blocks or something. Right now fuel blocks don't do anything.
 * @class
 * @namespace
 */
var FuelBlock = Part.extend({
	classId: 'FuelBlock',

	MAX_HP: 10,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(0, 211, 10)";
			this.textureSvg = ige.client.svgs.fuel;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FuelBlock; }
