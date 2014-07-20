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
		if (!ige.isServer) {
			this.backgroundColor = 0xF2F2F2;
			this.borderColor = 0x00D30A;
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(0, 211, 10)";
			this.textureSvg = ige.client.textures.fuel;
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FuelBlock; }
