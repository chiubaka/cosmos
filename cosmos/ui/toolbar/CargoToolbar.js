﻿var CargoToolbar = Toolbar.extend({
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
			self.log("Received cargo response", 'info');
			self.populateFromInventory(cargoItems);
		});

		this._cargoUpdateEvent = ige.on('cargo update', function(cargoItems) {
			self.log("Received cargo update", 'info');
			self.populateFromInventory(cargoItems);
		});

		this.log("Sending cargo request to server...", 'info');
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

		// If this is our initial populate from a cargo response, we
		// don't want to hear about it anymore.
		if (this._cargoResponseEvent !== undefined) {
			ige.off('cargo response', this._cargoResponseEvent);
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
		 */
		ige.emit('toolbar refresh');
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoToolbar;
}