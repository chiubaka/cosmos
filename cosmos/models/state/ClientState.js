/**
 * ClientState.js
 *
 * The ClientState object manages the current client state and handles switching
 * between different client game states and activating each states' associated capabilities.
 *
 * @author Derrick Liu
 * @class
 * @typedef {Object} Capability
 * @namespace  
 */
var ClientState = IgeClass.extend({
	classId: 'ClientState',

	/**
	 * The possible selected caps and the states that they induce.
	 * @type {Object}
   * @memberof ClientState
   * @instance
   * @private
	 */
	capStates: {
		'': 'idle',
		'MineCap': 'mine',
		'ConstructCap': 'construct'
	},

	/**
	 * Capabilities associated with states above.
	 * @type {Object}
   * @memberof ClientState
   * @instance
   * @private
	 */
	capabilities: {
		'mine': undefined,
		'construct': undefined,
		'idle': undefined
	},

	/**
	 * The currently selected capability identifier.
	 * @type {string}
   * @memberof ClientState
   * @instance
   * @private
   */
	_selectedCap: undefined,

	/**
	 * Initializes the capbar state handler and capabilities
   * @memberof ClientState
   * @instance
   */
	init: function() {
		this._initEvents();
		this._initCapabilities();

		// Default selected capability
		this.selectedCap('');
	},

	/**
	 * Initializes the capbar state handler and capabilities
   * @memberof ClientState
   * @instance
   * @private
   */
	_initEvents: function() {
		var self = this;

		ige.on('capbar cap selected', function(classId) {
			self.selectedCap(classId);
		});

		ige.on('capbar cap cleared', function(classId) {
			// Only reset to idle if we just deselected the current capability
			if (self.selectedCap() === self.capStates[classId]) {
				self.selectedCap('');
			}
		});
	},

	/**
	 * Initializes the capbar state handler and capabilities
   * @memberof ClientState
   * @instance
   * @private
   */
	_initCapabilities: function() {
		this.capabilities.mine = new MineCapability();
		this.capabilities.construct = new ConstructCapability();
		this.capabilities.idle = new Capability();
	},

	/**
	 * Select the currently active capability by choosing a cap, or get the currently active capability's identifier
	 * @param cap {string} the cap whose analogous capability to activate
	 * @returns {string} the current capability state identifier
	 * @memberof ClientState
   * @instance
   */
	selectedCap: function(cap) {
		if (cap !== undefined) {
			if (this._selectedCap !== undefined) {
				this.capabilities[this._selectedCap].deactivate();
			}

			if (this.capStates.hasOwnProperty(cap)) {
				this._selectedCap = this.capStates[cap];
			} else {
				this._selectedCap = this.capStates[''];
				console.error('invalid cap selected, reset to idle...');
			}

			this.capabilities[this._selectedCap].activate();

			this.log("Player selected " + this._selectedCap + " in capbar", 'info');
			ige.emit('clientstate selected cap changed', [this._selectedCap]);
		}

		return this._selectedCap;
	},

	// TODO: Support multiple current capabilities (active, passive)
	/**
	 * Gets the actual capability object associated with the currently selected capability.
	 * @returns {Object} the current capability's object
	 * @memberof ClientState
   * @instance
   */
	currentCapability: function() {
		return this.capabilities[this.selectedCap()];
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ClientState;
}