/**  
 * MineCapability.js
 * The MineCapability implementation encapsulates state checking and event
 * handling that drives the mining game mechanic. Specifically, it listens
 * for clicks on existing blocks and checks to see if they're minable.
 * 
 * @author Derrick Liu
 *
 * @class
 * @typedef {Object} MineCapability
 * @namespace  
 */
var MineCapability = Capability.extend({
	classId: "MineCapability",
	
	/**
	 * Initialize with MineCapability event registration
	 * @memberof MineCapability
	 * @instance
	 */
	init: function() {
		this.registeredEvents = {
			'Block': {
				'mousedown': {
					capability: this,
					conditionFunc: this.Block_canMouseDown,
					actionFunc: this.Block_mouseDown
				}
			},
			'ClickScene': {
				'mousedown': {
					capability: this,
					conditionFunc: this.ClickScene_canMouseDown,
					actionFunc: undefined
				}
			},
		};

		Capability.prototype.init.call(this);
	},

	/**
	 * Checks to see if the player has the mining cap selected
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof MineCapability
	 * @instance
	 */
	Block_canMouseDown: function(sender, event, data) {
		return (ige.client.state.selectedCap() === 'mine');
	},

	/**
	 * Send a command to the server to attempt mining the block that was just clicked on.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof MineCapability
	 * @instance
	 */
	Block_mouseDown: function(sender, event, data) {
		if (sender.parent().parent().classId() === BlockGrid.prototype.classId()) {
			ige.client.metrics.fireEvent('block', 'mine', sender.classId());
		} else {
			ige.client.metrics.fireEvent('player', 'attack', sender.classId());
		}

		ige.network.send('mineBlock', data);
	},

	/**
	 * Notifies the player that they cannot mine empty space
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof MineCapability
	 * @instance
	 */
	ClickScene_canMouseDown: function(sender, event, data) {
		ige.notification.emit('notificationError', 
			NotificationDefinitions.errorKeys.noMineEmptySpace);
		return false;
	},

});
