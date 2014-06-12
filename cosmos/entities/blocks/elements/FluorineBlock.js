/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {FluorineBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var FluorineBlock = Element.extend({
	classId: 'FluorineBlock',

	/**
	 * The maximum HP for a {@link FluorineBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof FluorineBlock
	 * @instance
	 */
	MAX_HP: 50,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(85, 26, 140)";
			this.textureOutline = "rgb(38, 38, 38)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FluorineBlock; }
