var MineCapability = Capability.extend({
	classId: "MineCapability",
	
	init: function() {
		this.registeredEvents = {
			'Block': {
				'mousedown': {
					capability: this,
					conditionFunc: this.Block_canMouseDown,
					actionFunc: this.Block_mouseDown
				}
			},
		};

		Capability.prototype.init.call(this);
	},

	Block_canMouseDown: function(sender, event, data) {
		return (ige.client.state.selectedCap() === 'mine');
	},


	Block_mouseDown: function(sender, event, data) {
		if (sender.parent().parent().classId() === BlockGrid.prototype.classId()) {
			ige.client.metrics.fireEvent('block', 'mine', sender.classId());
		} else {
			ige.client.metrics.fireEvent('player', 'attack', sender.classId());
		}

		ige.network.send('mineBlock', data);
	},
});