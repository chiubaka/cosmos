/**
 * Manages the elements and UI elements displayed to the user during gameplay
 * on a persistent heads-up display.
 *
 * Currently provides an entry point for initializing the {@link CapBar}, as
 * well as other HUD and related UI elements, in a single location.
 *
 * @class
 * @typedef {Object} HUDManager
 * @namespace
 */
var HUDManager = IgeClass.extend({
	classId: 'HUDManager',

	/**
	 * Holds a reference to the client capbar. At this point in the gameplay specs,
	 * there should only be one capbar per client.
	 * @type {Object}
	 * @memberof HUDManager
	 * @private
	 * @instance
	 */
	_capbar: undefined,

	/**
	 * Initializes all UI elements displayed on the HUD.
	 * @memberof HUDManager
	 * @instance
	 */
	init: function() {
		this.log("Initializing Player HUD...", 'info');

		this._capbar = new CapBar()
			.id("capbar")
			.mount(ige.client.hudScene);

		this._relocateButton = new RelocateButton()
			.id("relocateButton")
			.mount(ige.client.hudScene);

		this._newShipButton = new NewShipButton()
			.id("newShipButton")
			.mount(ige.client.hudScene);

		this._gpsLabel = new GPSLabel()
			.id("gpsLabel")
			.mount(ige.client.hudScene);
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = HUDManager;
}