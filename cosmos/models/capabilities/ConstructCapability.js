/**
 * ConstructCapability.js
 * The ConstructCapability implementation encapsulates state checking and event
 * handling that drives the construction game mechanic. Specifically, it listens
 * for clicks on existing blocks, and on the background, for CXB (construction
 * on existing blockgrids) and CNB (construction of new blockgrids).
 *
 * @author Derrick Liu
 * @class
 * @typedef {Object} ConstructCapability
 * @namespace
 */
var ConstructCapability = Capability.extend({
	classId: "ConstructCapability",
	selectedType: undefined,
	_toolbarListener: undefined,

	/**
	 * Initialize with ConstructCapability event registration
	 * @memberof ConstructCapability
	 * @instance
	 */
	init: function() {
		this.registeredEvents = {
			'ClickScene': {
				'mousedown': {
					capability: this,
					conditionFunc: this.ClickScene_canMouseDown,
					actionFunc: this.ClickScene_mouseDown
				}
			},
			'ConstructionOverlay': {
				'mousedown': {
					capability: this,
					conditionFunc: this.ConstructionOverlay_canMouseDown,
					actionFunc: this.ConstructionOverlay_mouseDown
				}
			},
			'Block': {
				'mousedown': {
					capability: this,
					conditionFunc: this.Block_canMouseDown,
					actionFunc: this.Block_mouseDown
				}
			}
		};
	},

	/**
	 * Upon activation, registers this capability as a listener on the Construction toolbar
	 * so the capability can store state about the currently selected item on the toolbar.
	 * @memberof ConstructCapability
	 * @instance
	 */
	activate: function() {
		this.log("Activating... registering event listener.", 'info');

		return this;
	},

	/**
	 * Upon deactivation, unregisters this capability as a toolbar listener.
	 * @memberof ConstructCapability
	 * @instance
	 */
	deactivate: function() {
		this.log("Deactivating... deregistering event listener.", 'info');

		return this;
	},

	/**
	 * Checks to see if the player has the construct cap selected and an itemType selected.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof ConstructCapability
	 * @instance
	 */
	ClickScene_canMouseDown: function(sender, event, data) {
		// Notify player that no block type is selected
		if (ige.hud.leftToolbar.windows.cargo.selectedType === undefined) {
			ige.notification.emit('notificationError',
				NotificationDefinitions.errorKeys.noItemTypeSelected);
		}
		return (ige.client.state.selectedCap() === 'construct' && ige.hud.leftToolbar.windows.cargo.selectedType !== undefined);
	},

	/**
	 * Sends a command to the server to create a new block at the point clicked.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof ConstructCapability
	 * @instance
	 */
	ClickScene_mouseDown: function(sender, event, data) {
		data.selectedType = ige.hud.leftToolbar.windows.cargo.selectedType;
		ige.client.metrics.track('cosmos:construct.attempt.new', {'type': ige.hud.leftToolbar.windows.cargo.selectedType});
		ige.network.send('constructNew', data);
	},

	/**
	* Checks to see if the player has the construct cap selected
	* @param sender {Object} an entity upon which an event was triggered
	* @param event {Object} the triggering event
	* @param data {Object} provided data that can be used in conditionFunc
	* @memberof ConstructCapability
	* @instance
	*/
	Block_canMouseDown: function(sender, event, data) {
		return (ige.client.state.selectedCap() === 'construct');
	},

	/**
	* Sends a command to the server to collect the block at the point clicked into the cargo.
	* @param sender {Object} an entity upon which an event was triggered
	* @param event {Object} the triggering event
	* @param data {Object} provided data that can be used in actionFunc
	* @memberof ConstructCapability
	* @instance
	*/
	Block_mouseDown: function(sender, event, data) {
		ige.client.metrics.track('cosmos:construct.attempt.deconstruct');

		data = {
			blockId: sender.id()
		};
		ige.network.send('deconstructionZoneClicked', data);
	},

	/**
	 * Checks to see if the player has the construct cap selected and an itemType selected.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof ConstructCapability
	 * @instance
	 */
	ConstructionOverlay_canMouseDown: function(sender, event, data) {
		// Notify player that no block type is selected
		if (ige.hud.leftToolbar.windows.cargo.selectedType === undefined) {
			ige.notification.emit('notificationError',
				NotificationDefinitions.errorKeys.noItemTypeSelected);
		}

		return (ige.client.state.selectedCap() === 'construct' &&
			ige.hud.leftToolbar.windows.cargo.selectedType !== undefined);
	},

	/**
	 * Sends a command to the server to create a new block at the point clicked.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof ConstructCapability
	 * @instance
	 */
	ConstructionOverlay_mouseDown: function(sender, event, data) {
		data.selectedType = ige.hud.leftToolbar.windows.cargo.selectedType;
		ige.client.metrics.track('cosmos:construct.attempt.existing',
			{'type': ige.hud.leftToolbar.windows.cargo.selectedType});

		ige.network.send('constructionZoneClicked', data);
	}
});
