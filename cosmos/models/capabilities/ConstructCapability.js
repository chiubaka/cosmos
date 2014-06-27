﻿/**  
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
			'ConstructionZoneOverlay': {
				'mousedown': {
					capability: this,
					conditionFunc: this.ConstructionZoneOverlay_canMouseDown,
					actionFunc: this.ConstructionZoneOverlay_mouseDown
				}
			}
			// TODO: Implement construction on existing block grids here.
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

		var self = this;
		this._toolbarListener = ige.on('toolbar tool selected', function(classId, toolName) {
			if (classId === CargoComponent.prototype.classId()) {
				self.log("Selected item type " + toolName, 'info');
				self.selectedType = toolName;
			}
		});

		return this;
	},

	/**
	 * Upon deactivation, unregisters this capability as a toolbar listener.
	 * @memberof ConstructCapability
	 * @instance
	 */
	deactivate: function() {
		this.log("Deactivating... deregistering event listener.", 'info');
		ige.off('toolbar tool selected', this._toolbarListener);

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
		if (this.capability.selectedType === undefined) {
			ige.notification.emit('notificationError', 
				NotificationDefinitions.errorKeys.noItemTypeSelected);
		}
		return (ige.client.state.selectedCap() === 'construct' && this.capability.selectedType !== undefined);
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
		data.selectedType = this.capability.selectedType;
		ige.client.metrics.fireEvent('construct', 'attempt new', this.capability.selectedType);
		ige.network.send('constructNew', data);
	},

	/**
	 * Checks to see if the player has the construct cap selected and an itemType selected.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof ConstructCapability
	 * @instance
	 */
	ConstructionZoneOverlay_canMouseDown: function(sender, event, data) {
		// Notify player that no block type is selected
		if (this.capability.selectedType === undefined) {
			ige.notification.emit('notificationError', 
				NotificationDefinitions.errorKeys.noItemTypeSelected);
		}
		return (ige.client.state.selectedCap() === 'construct' && this.capability.selectedType !== undefined);
	},

	/**
	 * Sends a command to the server to create a new block at the point clicked.
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof ConstructCapability
	 * @instance
	 */
	ConstructionZoneOverlay_mouseDown: function(sender, event, data) {
		data.selectedType = this.capability.selectedType;
		ige.client.metrics.fireEvent('construct', 'attempt existing', this.capability.selectedType);
		ige.network.send('constructionZoneClicked', data);
	},
});
