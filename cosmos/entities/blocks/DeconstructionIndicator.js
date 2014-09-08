/**
 * This class is supposed to be instantiated exactly once on each client.
 * Subclass of the {@link Block} class.
 * @class
 * @typedef {DeconstructionIndicator}
 * @namespace
 */
var DeconstructionIndicator = Block.extend({
	classId: 'DeconstructionIndicator',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x11FF0000;
			this.borderColor = 0xFF0000;

			this.iconFrame = "ConstructionZone.png";
			//this.textureSvg = ige.client.textures.constructionZone;

			this.backgroundAlpha = 0.3;
			this.textureBackground = "rgb(255, 0, 0, 0.3)";
			this.textureOutline = "rgb(255, 0, 0)";
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DeconstructionIndicator;
}
