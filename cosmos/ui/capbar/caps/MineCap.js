/**
 * The MineCap allows players to interface with the mining game mechanic. Players
 * select the MineCap on the CapBar to enter mining mode, which allows them to
 * mine blocks on the outside of BlockGrids.
 *
 * @class
 * @typedef {Object} MineCap
 * @namespace  
 */
var MineCap = Cap.extend({
	classId: "MineCap",

	/**
	 * The name of the Cap and the title used by the attached CapLabel.
	 * @constant {string}
	 * @default
	 * @memberof MineCap
	 * @instance
	 */
	CAP_NAME: "Mine",

	/**
	 * The MineCap's stub RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof MineCap
	 * @instance
	 */
	STUB_COLOR: "rgb(200,32,32)",

	/**
	 * The MineCap's background RGB color value when the player clicks
	 * on the Cap.
	 * @constant {string}
	 * @default
	 * @memberof MineCap
	 * @instance
	 */
	ACTIVE_COLOR: "rgb(200, 32, 32)",

	/**
	 * The MineCap's stub RGB color value when the player clicks on 
	 * the Cap.
	 * @constant {string}
	 * @default
	 * @memberof MineCap
	 * @instance
	 */
	ACTIVE_STUB_COLOR: "rgb(255, 64, 64)",

	/**
	 * The MineCap's background RGB color value when the player hovers 
	 * over the Cap.
	 * @constant {string}
	 * @default
	 * @memberof MineCap
	 * @instance
	 */
	HOVER_COLOR: 'rgb(255, 64, 64)',

	/**
	 * Sets the MineCap's icons and defers to the {@link Cap#init} function.
	 * @memberof MineCap
	 * @instance
	 */
	init: function() {
		this.NORMAL_ICON = ige.client.textures.mineCap_color;
		this.ACTIVE_ICON = ige.client.textures.mineCap_white;

		Cap.prototype.init.call(this);
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = MineCap;
}