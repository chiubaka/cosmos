var ClientState = IgeClass.extend({
	classId: 'ClientState',

	/**
	 * The possible capabilities and the states that they induce.
	 */
	capStates: {
		'': 'idle',
		'MineCap': 'mine',
		'ConstructCap': 'construct'
	},

	_currentState: undefined,

	init: function() {
		var self = this;

		ige.on('capbar cap selected', function(classId) {
			self.state(self.capStates[classId]);
		});

		ige.on('capbar cap cleared', function(classId) {
			self.state(self.capStates['']);
		});

		this.state(this.capStates['']);
	},

	state: function(newState) {
		if (newState !== undefined) {
			this._currentState = newState;
			console.log("Client state changed: " + this._currentState);
			ige.emit('client state changed', [this._currentState]);
		}

		return this._currentState;
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ClientState;
}