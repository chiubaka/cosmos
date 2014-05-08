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
		};
	},

	activate: function() {
		console.log("Activating ConstructCapability: registering event listener.");

		var self = this;
		this._toolbarListener = ige.on('toolbar tool selected', function(classId, toolName) {
			if (classId === CargoTool.prototype.classId()) {
				console.log("ConstructCapability selected type " + toolName);
				self.selectedType = toolName;
				console.log(self.selectedType);
			}
		});

		return this;
	},

	deactivate: function() {
		console.log("Deactivating ConstructCapability: deregistering event listener.");
		ige.off('toolbar tool selected', this._toolbarListener);

		return this;
	},

	ClickScene_canMouseDown: function(sender, event, data) {
		return (ige.client.state.selectedCap() === 'construct' && this.capability.selectedType !== undefined);
	},

	ClickScene_mouseDown: function(sender, event, data) {
		data.selectedType = this.capability.selectedType;
		ige.network.send('constructNew', data);
	}
});