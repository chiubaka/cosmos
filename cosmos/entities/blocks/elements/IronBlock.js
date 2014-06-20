/**
 * Subclass of the {@link Element} class. An IronBlock is a basic element.
 * @class
 * @typedef {IronBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var IronBlock = Element.extend({
	classId: 'IronBlock',

	/**
	 * The maximum HP for a {@link IronBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof IronBlock
	 * @instance
	 */
	MAX_HP: 25,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(200, 200, 200)";
			this.textureOutline = "rgb(210, 210, 210)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
