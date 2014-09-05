/**
 * This class is supposed to be instantiated exactly once on each client.
 * Subclass of the {@link Block} class.
 * @class
 * @typedef {DeconstructionBlock}
 * @namespace
 */
var DeconstructionBlock = Block.extend({
	classId: 'DeconstructionBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x11770000;
			this.borderColor = 0x780000;

			//this.iconFrame = 'construction_zone';
			//this.textureSvg = ige.client.textures.constructionZone;

			this.backgroundAlpha = 0.3;
			this.textureBackground = "rgb(119, 0, 0, 0.3)";
			this.textureOutline = "rgb(140, 0, 0)";
			/*
			var self = this;
			ige.on("capbar cap selected", function (classId) {
				if (classId === ConstructCap.prototype.classId()) {
					console.log("showing (cap selected)");
					self.show();
				} else {
					console.log("hiding (cap selected)");
					self.hide();
				}
			});

			ige.on("capbar cap cleared", function (classId) {
				// If the construction capability is deselected, hide the DeconstructionBlock.
				if (classId === ConstructCap.prototype.classId()) {
					console.log("not actually hiding (cap cleared) classId: " + classId);
					//self.hide();
				}
			});
			*/
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DeconstructionBlock;
}
