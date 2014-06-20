/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {CarbonBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var CarbonBlock = Element.extend({
	classId: 'CarbonBlock',

	/**
	 * The maximum HP for a {@link CarbonBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof CarbonBlock
	 * @instance
	 */
	MAX_HP: 15,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(40, 40, 40)";
			this.textureOutline = "rgb(80, 80, 80)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CarbonBlock; }
