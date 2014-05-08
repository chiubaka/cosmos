var ClientState = IgeClass.extend({
	classId: 'ClientState',

	/**
	 * The possible selected caps and the states that they induce.
	 */
	capStates: {
		'': 'idle',
		'MineCap': 'mine',
		'ConstructCap': 'construct'
	},

	/**
	 * Capabilities associated with states above.
	 */
	capabilities: {
		'mine': undefined,
		'construct': undefined,
		'idle': undefined
	},

	_selectedCap: undefined,

	init: function() {
		this.initEvents();
		this.initCapabilities();

		// Default selected capability
		this.selectedCap('');
	},

	initEvents: function() {
		var self = this;

		ige.on('capbar cap selected', function(classId) {
			self.selectedCap(classId);
		});

		ige.on('capbar cap cleared', function(classId) {
			self.selectedCap('');
		});
	},

	initCapabilities: function() {
		this.capabilities.mine = new MineCapability();
		this.capabilities.construct = new ConstructCapability();
		this.capabilities.idle = new Capability();
	},

	selectedCap: function(cap) {
		if (cap !== undefined) {
			if (this._selectedCap !== undefined) {
				this.capabilities[this._selectedCap].deactivate();
			}

			if (this.capStates.hasOwnProperty(cap)) {
				this._selectedCap = this.capStates[cap];
			} else {
				this._selectedCap = this.capStates[''];
				console.log('invalid cap selected, reset to idle...');
			}

			this.capabilities[this._selectedCap].activate();

			console.log("Client selected cap changed: " + this._selectedCap);
			ige.emit('clientstate selected cap changed', [this._selectedCap]);
		}

		return this._selectedCap;
	},

	// TODO: Support multiple current capabilities (active, passive)
	currentCapability: function() {
		return this.capabilities[this.selectedCap()];
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ClientState;
}