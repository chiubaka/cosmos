var Capability = IgeClass.extend({
	classId: "Capability",

	registeredEvents: undefined,

	init: function() {
		if (this.registeredEvents === undefined) {
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
		}
	},

	/**
	 * Stub functions implemented by child classes that are called
	 * when Capabilities are activated by ClientState
	 */
	activate: function() {
		return this;
	},

	/**
	 * Stub functions implemented by child classes that are called
	 * when Capabilities are deactivated by ClientState
	 */
	deactivate: function() {
		return this;
	},

	checkRegistration: function(senderClass, event) {
		return (this.registeredEvents.hasOwnProperty(senderClass) &&
				this.registeredEvents[senderClass].hasOwnProperty(event.type));
	},

	// TODO: Use when class extension is enhanced to have a stack of parent inheritor classes
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

	Block_canMouseDown: function(sender, event, data) {
		return true;
	},

	ClickScene_canMouseDown: function(sender, event, data) {
		return true;
	},

	/**
	 * Performs an action (void return)
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

	Block_mouseDown: function(sender, event, data) {
		console.log("IdleCapability: received mouseDown (button " + event.button + ") on a block (classId: " + sender.classId() + ", id: " + sender.id() + "!");
	},

	ClickScene_mouseDown: function(sender, event, data) {
		console.log("IdleCapability: received mouseDown (button " + event.button + ") on the background!");
	},

	/**
	 * @returns a boolean whether or not the action was performed
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