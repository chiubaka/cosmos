/**
 * A Cap represents a Cap that the player can interface with to interface
 * with the game environment, similar to a tool in a tool palette. The CapBar can
 * host multiple Caps, all of different types.
 *
 * @class
 * @typedef {Object} Cap
 * @namespace  
 */
var Cap = ButtonComponent.extend({
	classId: "Cap",

	active: undefined,

	/**
	 * Initializes the Cap's styles, label, and attaches event emitters and listeners.
	 * @memberof Cap
	 * @instance
	 */
	init: function(parent, id, className) {
		ButtonComponent.prototype.init.call(this, parent, id, className);

		console.log(this.element);

		this.active = false;

		// Set up events
		this.initEvents();
	},

	/**
	 * Initializes event listeners for player interaction events and client events
	 * that may trigger a capbar state change.
	 * @memberof Cap
	 * @instance
	 */
	initEvents: function() {
		var self = this;

		this.element.click(function() {
			if (self.active) {
				self.deselect();
			}
			else {
				self.select();
			}
		});

		ige.on('capbar cap selected', function(classId) {
			if (!self.active && classId === self.classId()) {
				self.select();
			}
			else if (classId !== self.classId()) {
				self.deselect();
			}
		});
	},

	/**
	 * Triggered when the Cap is selected via a player interaction or via another
	 * client event. Applies appropriate selection styles, mounts and shows an attached
	 * toolbar, if one is defined for this Cap.
	 * @memberof Cap
	 * @instance
	 */
	select: function() {
		this.element.addClass('active');
		this.active = true;
		ige.emit('capbar cap selected', [this.classId()]);
	},

	/**
	 * Triggered when the Cap is deselected via a player interaction or via another
	 * client event. Applies normal styles, hides and unmounts an attached
	 * toolbar, if one is defined for this Cap.
	 * @memberof Cap
	 * @instance
	 */
	deselect: function() {
		this.element.removeClass('active');
		this.active = false;
		ige.emit('capbar cap cleared', [this.classId()]);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Cap;
}