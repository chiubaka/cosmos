/**
 * Subclass of the {@link Part} class. FuelBlocks provide fuel for the engines.
 * @class
 * @typedef {FuelBlock}
 * @namespace
 * @todo Engines should actually consume fuel blocks or something. Right now fuel blocks don't do anything.
 */
var FuelBlock = Part.extend({
	classId: 'FuelBlock',

	init: function(data) {
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(0, 211, 10)";
			this.textureSvg = ige.client.svgs.fuel;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FuelBlock; }
