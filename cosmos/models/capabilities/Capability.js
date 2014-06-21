/**  
 * Capability.js
 * Capabilities are modules that encapsulate gameplay state, state-checking,
 * and functions that perform actions in a way that is easily extensible and
 * maintainable. Capabilities can also store info that's related to a particular
 * state.
 *
 * @author Derrick Liu 
 * @class
 * @typedef {Object} Capability
 * @namespace  
 */
var Capability = IgeClass.extend({
	classId: "Capability",

  /**
   * Represents the events that the capability listens for and acts upon. Should
   * be defined in subclasses, but a default is defined in {@link Capability#init}
   * for reference.
   * @type {Object}
   * @memberof Capability
   * @instance
   * @private
   */
	registeredEvents: undefined,

	/**
	 * Initialize the capability with some default registered events.
	 * @memberof Capability
	 * @instance
	 */
	init: function() {
		if (this.registeredEvents === undefined) {
			this.registeredEvents = {
				'Block': {
					'mousedown': {
						// Note: Since calling this in either the conditionFunc or actionFunc will 
						// refer to this object (the one this comment is in), we include 
						// the capability field to allow easy access to the Capability object itself.
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
		}
	},

	/**
	 * Stub functions implemented by child classes that are called
	 * when Capabilities are activated by ClientState
	 * @memberof Capability
	 * @instance
	 */
	activate: function() {
		return this;
	},

	/**
	 * Stub functions implemented by child classes that are called
	 * when Capabilities are deactivated by ClientState
	 * @memberof Capability
	 * @instance
	 */
	deactivate: function() {
		return this;
	},

	/**
	 * Selects a registered event from the registeredEvents list that is the most relevant
	 * to the entity type / event type pair provided.
	 * 
	 * If a registered event does not exactly match the entity classId, this method will
	 * traverse up the entity class hierarchy in case a parent classId is registered.
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @returns {string} the classId of a registered event, or undefined if none can be found
	 * @memberof Capability
	 * @instance
	 */
	selectRegistration: function(sender, event) {
		var selectedClass, currentPrototype = sender;

		var traversalIterations = 0;
		while (true) {
			// If we've driven off the end of the class hierarchy (or there seems to be a loop somewhere), abort!
			if (currentPrototype === null ||
				currentPrototype.classId === undefined ||
				traversalIterations > 10) {
				return undefined;
			}

			if (this.registeredEvents.hasOwnProperty(currentPrototype.classId())) {
				selectedClass = currentPrototype.classId();
				break;
			}

			currentPrototype = Object.getPrototypeOf(currentPrototype);
			traversalIterations++;
		}

		if (this.registeredEvents[selectedClass].hasOwnProperty(event.type)) {
			return selectedClass;
		} else {
			return undefined;
		}
	},

	/**
	 * Checks whether or not an event action can be performed in the current game state.
	 * 
	 * Calls the conditionFunc associated with the registered event for this entity/event pair.
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc and actionFunc
	 * @returns {boolean} whether or not the event action can be performed
	 * @memberof Capability
	 * @instance
	 */
	canDo: function(sender, event, data) {
		// Check if we have this event and sender registered for this capability
		var selectedClass = this.selectRegistration(sender, event);
		if (selectedClass === undefined) {
			console.warn("Event type (" + event.type + ") / sender (" + sender.classId() + ") not registered!");
			return false;
		}

		// The event and sender are registered, so we can handle it.
		return this.registeredEvents[selectedClass][event.type].conditionFunc(sender, event, data);
	},

	/**
	 * Default stub for demonstrating a conditionFunc
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof Capability
	 * @instance
	 */
	Block_canMouseDown: function(sender, event, data) {
		return true;
	},

	/**
	 * Default stub for demonstrating a conditionFunc
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc
	 * @memberof Capability
	 * @instance
	 */
	ClickScene_canMouseDown: function(sender, event, data) {
		return true;
	},

	/**
	 * Performs a registered event action for the entity/event pair.
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof Capability
	 * @instance
	 */
	performAction: function(sender, event, data) {
		// Check if we have this event and sender registered for this capability
		var selectedClass = this.selectRegistration(sender, event);
		if (selectedClass === undefined) {
			console.warn("Event type (" + event.type + ") / sender (" + sender.classId() + ") not registered!");
			return;
		}

		this.registeredEvents[selectedClass][event.type].actionFunc(sender, event, data);
	},

	/**
	 * Default stub for demonstrating an actionFunc
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof Capability
	 * @instance
	 */
	Block_mouseDown: function(sender, event, data) {
		ige.notification.emit('notificationError',
			NotificationDefinitions.errorKeys.noCapability);
		console.log("IdleCapability: received mouseDown (button " + event.button + ") on a block (classId: " + sender.classId() + ", id: " + sender.id() + "!");
	},

	/**
	 * Default stub for demonstrating an actionFunc
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in actionFunc
	 * @memberof Capability
	 * @instance
	 */
	ClickScene_mouseDown: function(sender, event, data) {
		ige.notification.emit('notificationError',
			NotificationDefinitions.errorKeys.noCapability);
		console.log("IdleCapability: received mouseDown (button " + event.button + ") on the background!");
	},

	/**
	 * Convenience function to test using canDo and act using performAction in one fell swoop.
	 * 
	 * @param sender {Object} an entity upon which an event was triggered
	 * @param event {Object} the triggering event
	 * @param data {Object} provided data that can be used in conditionFunc and actionFunc
	 * @returns {boolean} whether or not the action was performed
	 * @memberof Capability
	 * @instance
	 */
	tryPerformAction: function(sender, event, data) {
		if (this.canDo(sender, event, data)) {
			this.performAction(sender, event, data);
			return true;
		}

		return false;
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Capability;
}
