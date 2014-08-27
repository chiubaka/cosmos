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
					actionFunc: this.ClickScene_mouseDown
				}
			}
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
		console.log("Block_mouseDown");
		console.log(data);
		_.forEach(ige.client.player.currentShip().weapons(), function(weapon) {
			weapon.fireClient(data);
		});

		/*if (sender.parent().parent() instanceof Ship) {
			ige.client.metrics.track('cosmos:block.attack', {'type': sender.classId()});//note that this includes when you mine yourself
		} else {
			ige.client.metrics.track('cosmos:block.mine', {'type': sender.classId()});
		}

		ige.network.send('mineBlock', data);*/
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
		// TODO: Fire lasers individually-- understand which laser is selected. For now, all lasers
		// are fired together.

		return (ige.client.state.selectedCap() === 'mine');
	},

	ClickScene_mouseDown: function(sender, event, data) {
		_.forEach(ige.client.player.currentShip().weapons(), function(weapon) {
			weapon.fireClient(data);
		});
	}
});
