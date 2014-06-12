/**
 * Subclass of the {@link Part} class. FuelBlocks provide fuel for the engines.
 * @class
 * @typedef {FuelBlock}
 * @namespace
 * @todo Engines should actually consume fuel blocks or something. Right now fuel blocks don't do anything.
 */
var FuelBlock = Part.extend({
	classId: 'FuelBlock',

	/**
	 * The maximum HP for a {@link FuelBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof FuelBlock
	 * @instance
	 */
	MAX_HP: 10,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(0, 211, 10)";
			this.textureSvg = ige.client.svgs.fuel;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FuelBlock; }
