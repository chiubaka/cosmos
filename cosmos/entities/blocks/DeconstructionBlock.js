/**
* Subclass of the {@link Element} class.
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

			this.iconFrame = 'construction_zone';
			this.textureSvg = ige.client.textures.constructionZone;

			this.backgroundAlpha = 0.3;
			this.textureBackground = "rgb(119, 0, 0, 0.3)";
			this.textureOutline = "rgb(140, 0, 0)";

			var self = this;
			var listener = ige.on("capbar cap selected", function (classId) {
				if (classId === ConstructCap.prototype.classId()) {
					self.show();
				} else {
					self.hide();
				}
			});

			var listener = ige.on("capbar cap cleared", function (classId) {
				self.hide();
			});
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DeconstructionBlock;
}
