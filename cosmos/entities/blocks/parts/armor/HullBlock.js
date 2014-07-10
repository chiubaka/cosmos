/**
 * Subclass of the {@link Element} class. An HullBlock is the most basic armor
 * block.
 * @class
 * @typedef {Armor} HullBlock
 * @namespace
 */
var HullBlock = Armor.extend({
	classId: 'HullBlock',

	/**
	 * The maximum HP for a {@link HullBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof HullBlock
	 * @instance
	 */
	MAX_HP: 30,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(217, 217, 217)";
			this.textureOutline = "rgb(201, 201, 201)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HullBlock; }
