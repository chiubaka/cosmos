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
		sender._displayHealth = true;

		sender.decrementHealthIntervalId = setInterval(function() {
			if (sender._hp > 0) {
				sender._hp--;
				sender.cacheDirty(true);
			}
			if (sender._hp == 0) {
				clearInterval(sender.decrementHealthIntervalId);
			}
		}, sender.MINING_TIME / sender._maxHp);

		ige.network.send('mineBlock', data);
	},
});