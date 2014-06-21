/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {CobaltBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var CobaltBlock = Element.extend({
	classId: 'CobaltBlock',

	/**
	 * The maximum HP for a {@link CobaltBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof CobaltBlock
	 * @instance
	 */
	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(0, 71, 171)";
			this.textureOutline = "rgb(0, 0, 128)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CobaltBlock; }
