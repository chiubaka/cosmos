/**
 * Subclass of the {@link Element} class. A GoldBlock is a rare {@link Element} that may have a high value or good
 * crafting properties.
 * @class
 * @typedef {GoldBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var GoldBlock = Element.extend({
	classId: 'GoldBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xFFD700;
			this.borderColor = 0xDAA520;
			this.textureBackground = "rgb(255,215,0)";
			this.textureOutline = "rgb(218,165,32)";
		}

		Element.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GoldBlock; }
