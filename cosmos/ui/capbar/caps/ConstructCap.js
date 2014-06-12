var ConstructCap = Cap.extend({
	classId: "ConstructCap",

	/**
	 * The name of the Cap and the title used by the attached CapLabel.
	 * @constant {string}
	 * @default
	 * @memberof ConstructCap
	 * @instance
	 */
	CAP_NAME: "Construct",

	/**
	 * The ConstructCap's stub RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof ConstructCap
	 * @instance
	 */
	STUB_COLOR: "rgb(2,108,210)",

	/**
	 * The ConstructCap's background RGB color value when the player clicks
	 * on the Cap.
	 * @constant {string}
	 * @default
	 * @memberof ConstructCap
	 * @instance
	 */
	ACTIVE_COLOR: "rgb(2,108,210)",

	/**
	 * The ConstructCap's stub RGB color value when the player clicks on 
	 * the Cap.
	 * @constant {string}
	 * @default
	 * @memberof ConstructCap
	 * @instance
	 */
	ACTIVE_STUB_COLOR: "rgb(3,131,255)",

	/**
	 * The ConstructCap's background RGB color value when the player hovers 
	 * over the Cap.
	 * @constant {string}
	 * @default
	 * @memberof ConstructCap
	 * @instance
	 */
	HOVER_COLOR: 'rgb(3,131,255)',

	/**
	 * Sets the ConstructCap's icons, attaches the Construction toolbar,
	 * and defers to the {@link Cap#init} function.
	 * @memberof ConstructCap
	 * @instance
	 */
	init: function() {
		this.NORMAL_ICON = ige.client.textures.constructCap_color;
		this.ACTIVE_ICON = ige.client.textures.constructCap_white;

		this._toolbar = new CargoToolbar();

		Cap.prototype.init.call(this);
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ConstructCap;
}