/**
 * The Cargo Toolbar presents players with their cargo inventory so they can select
 * which blocks to place with the {@link ConstructCap} construction mechanic.
 *
 * @class
 * @typedef {Object} Toolbar
 * @namespace 
 */
var CargoToolbar = Toolbar.extend({
	classId: 'CargoToolbar',

	/**
	 * The Toolbar's default RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof CargoToolbar
	 * @instance
	 */
	BG_COLOR: 'rgb(2,108,210)',

	/**
	 * The Toolbar's default border color
	 * @constant {string}
	 * @default
	 * @memberof CargoToolbar
	 * @instance
	 */
	BORDER_COLOR: 'rgb(3,131,255)',

	/**
	 * The message to display when the toolbar is loading after a cap selection event.
	 * @constant {string}
	 * @default
	 * @memberof CargoToolbar
	 * @instance
	 */
	PLACEHOLDER_LOADING: "Getting your cargo...",

	/**
	 * The message to display when the toolbar doesn't have any Tools in it.
	 * @constant {string}
	 * @default
	 * @memberof CargoToolbar
	 * @instance
	 */
	PLACEHOLDER_EMPTY: "It's lonely in here... \nGo mine something!",

	/**
	 * An event that is called when the server responds to the client's cargo inventory request.
	 *
	 * @memberof CargoToolbar
	 * @type {Object}
	 * @instance
	 * @private
	 */
	_cargoResponseEvent: undefined,

	/**
	 * Initializes the Toolbar's styles and placeholder label.
	 * @memberof CargoToolbar
	 * @instance
	 */
	init: function() {
		Toolbar.prototype.init.call(this);
	},

	/**
	 * Overrides the Toolbar mount call to additionally make a cargo request to the server
	 * and register event handlers for the server's cargo response and future updates.
	 * @param obj {Object} the object to mount this CargoToolbar to
	 * @memberof CargoToolbar
	 * @instance
	 */
	mount: function(obj) {
		Toolbar.prototype.mount.call(this, obj);

		var self = this;
		ige.on('cargo response', function(cargoItems) {
			self.log("Received cargo response", 'info');
			self.populateFromInventory(cargoItems);
		}, self, true);

		this._cargoUpdateEvent = ige.on('cargo update', function(cargoItems) {
			self.log("Received cargo update", 'info');
			self.populateFromInventory(cargoItems);
		});

		this.log("Sending cargo request to server...", 'info');
		var data = { requestUpdates: true };
		ige.network.send('cargoRequest', data);
	},

	/**
	 * Overrides the Toolbar unmount call to deregister this CargoToolbar from receiving
	 * any further cargo updates from the server.
	 * @memberof CargoToolbar
	 * @instance
	 */
	unMount: function() {
		ige.off('cargo update', this._cargoUpdateEvent);
		var data = { requestUpdates: false };
		ige.network.send('cargoRequest', data);
		Toolbar.prototype.unMount.call(this);
	},

	/**
	 * Iterates through the cargo items received from the server update and creates
	 * a new Tool in the CargoToolbar representing that item and its quantity.
	 * @param cargoItems {Object} a dictionary of cargo items and their quantities
	 * @memberof CargoToolbar
	 * @instance
	 */
	populateFromInventory: function(cargoItems) {
		var selectedType = ige.client.state.currentCapability().selectedType;
		this.log("Populating toolbar from server response: " + Object.keys(cargoItems).length + " item(s) in inventory", 'info');

		// Clear out the existing tools in the tools palette.
		for (var i = 0; i < this._tools.length; i++) {
			this._tools[i].destroy();
		}
		this._tools.length = 0;

		// Iterate through the cargo items and create a new 'tool' in the palette for the item.
		for (var type in cargoItems) {
			var quantity = cargoItems[type];
			var tool = new CargoTool(type, quantity);
			this._tools.push(tool);
		}

		// If the selectedType is no longer in the cargo inventory, just select the first one in the list
		var needToReselect = (selectedType !== undefined && !cargoItems.hasOwnProperty(selectedType));

		/*
		 * Tools were being destroyed, and some events that are registered to these tools are deregistered in the process. 
		 * However, if an event deregistration and an event emission for that same event occur in a single call chain, 
		 * then the event deregistration won't have time to propagate through the event queue, which will cause the 
		 * event emission to fail.
		 * 
		 * By changing the toolbar tool remount call to an event emission, the event deregistration can occur before an event
		 * emission for that same event occurs, since the toolbar tool remount is guaranteed to occur after the event deregistration.
		 *
		 * ADDENDUM: The IGE event handler implementation now skips handling event emissions that have been cleared out (set to undefined)
		 */
		ige.emit('toolbar refresh', [needToReselect]);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoToolbar;
}