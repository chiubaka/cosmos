var ConstructCapability = Capability.extend({
	classId: "ConstructCapability",
	selectedType: undefined,
	_toolbarListener: undefined,

	init: function() {
		this.registeredEvents = {
			'ClickScene': {
				'mousedown': {
					capability: this,
					conditionFunc: this.ClickScene_canMouseDown,
					actionFunc: this.ClickScene_mouseDown
				}
			}
			// TODO: Implement construction on existing block grids here.
		};
	},

	/**
	 * Upon activation, registers this capability as a listener on the Construction toolbar
	 * so the capability can store state about the currently selected item on the toolbar.
	 */
	activate: function() {
		console.log("Activating... registering event listener.", 'info');

		var self = this;
		this._toolbarListener = ige.on('toolbar tool selected', function(classId, toolName) {
			if (classId === CargoTool.prototype.classId()) {
				self.log("Selected item type " + toolName, 'info');
				self.selectedType = toolName;
				console.log(self.selectedType);
			}
		});

		return this;
	},

	/**
	 * Upon deactivation, unregisters this capability as a toolbar listener.
	 */
	deactivate: function() {
		this.log("Deactivating... deregistering event listener.", 'info');
		ige.off('toolbar tool selected', this._toolbarListener);

		return this;
	},

	/**
	 * Checks to see if the player has the construct cap selected and an itemType selected.
	 */
	ClickScene_canMouseDown: function(sender, event, data) {
		return (ige.client.state.selectedCap() === 'construct' && this.capability.selectedType !== undefined);
	},

	/**
	 * Sends a command to the server to create a new block at the point clicked.
	 */
	ClickScene_mouseDown: function(sender, event, data) {
		data.selectedType = this.capability.selectedType;
		ige.client.metrics.fireEvent('construct', 'new', this.capability.selectedType);
		ige.network.send('constructNew', data);
	}
});