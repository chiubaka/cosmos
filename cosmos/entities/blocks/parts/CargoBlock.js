/**
 * Subclass of the {@link Part} class. The cargo block is a ship part which will hold cargo.
 * The current plan is to have each cargo block allow you to hold one more type of block in your inventory. Each cargo
 * slot will also hold a maximum number of {@link Block}s.
 * @class
 * @typedef {CargoBlock}
 * @namespace
 */
var CargoBlock = Part.extend({
	classId: 'CargoBlock',

	/**
	 * The maximum HP for a {@link CargoBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof CargoBlock
	 * @instance
	 */
	MAX_HP: 20,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(38, 38, 38)";
			this.textureSvg = ige.client.svgs.cargo;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CargoBlock; }
