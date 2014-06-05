var HUDManager = IgeClass.extend({
	classId: 'HUDManager',

	_capbar: undefined,

	init: function() {
		this.log("Initializing Player HUD...", 'info');

		this._capbar = new CapBar()
			.id("capbar")
			.mount(ige.client.hudScene);

		this._relocateButton = new RelocateButton()
			.id("relocateButton")
			//.mount(ige.client.hudScene);

		this._newShipButton = new NewShipButton()
			.id("newShipButton")
			//.mount(ige.client.hudScene);

		this._gpsLabel = new GPSLabel()
			.id("gpsLabel")
			//.mount(ige.client.hudScene);
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = HUDManager;
}
