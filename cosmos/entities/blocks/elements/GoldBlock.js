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

	/**
	 * The maximum HP for a {@link GoldBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof GoldBlock
	 * @instance
	 */
	MAX_HP: 50,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(255,215,0)";
			this.textureOutline = "rgb(218,165,32)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GoldBlock; }
