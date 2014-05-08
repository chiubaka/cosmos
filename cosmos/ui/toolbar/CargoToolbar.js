var CargoToolbar = Toolbar.extend({
	classId: 'CargoToolbar',

	BG_COLOR: 'rgb(2,108,210)',
	BORDER_COLOR: 'rgb(3,131,255)',

	PLACEHOLDER_LOADING: "Getting your cargo...",
	PLACEHOLDER_EMPTY: "It's lonely in here... \nGo mine something!",

	_cargoResponseEvent: undefined,

	init: function() {
		Toolbar.prototype.init.call(this);
	},

	mount: function(obj) {
		Toolbar.prototype.mount.call(this, obj);

		var self = this;
		this._cargoResponseEvent = ige.on('cargo response', function(cargoItems) {
			console.log("CargoToolbar: Received cargo response");
			self.populateFromInventory(cargoItems);
		});

		this._cargoUpdateEvent = ige.on('cargo update', function(cargoItems) {
			console.log("CargoToolbar: Received cargo update");
			self.populateFromInventory(cargoItems);
		});

		console.log("Sending cargo request...");
		var data = { requestUpdates: true };
		ige.network.send('cargoRequest', data);
	},

	unMount: function() {
		ige.off('cargo update', this._cargoUpdateEvent);
		var data = { requestUpdates: false };
		ige.network.send('cargoRequest', data);
		Toolbar.prototype.unMount.call(this);
	},

	populateFromInventory: function(cargoItems) {
		console.log("Populating inventory from callback... " + Object.keys(cargoItems).length + " item(s) in inventory");

		// Clear out the existing tools in the tools palette.
		for (var i = 0; i < this._tools.length; i++) {
			this._tools[i].destroy();
		}
		this._tools.length = 0;

		// Iterate through the cargo items and create a new 'tool' in the palette for the item.
		for (var type in cargoItems) {
			var quantity = cargoItems[type];

			this._tools.push(new CargoTool(type, quantity));
		}

		ige.off('cargo response', this._cargoResponseEvent);		
		this.mountTools();
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoToolbar;
}