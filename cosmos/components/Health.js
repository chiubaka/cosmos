var Health = TLStreamedEntityComponent.extend({
	classId: 'Health',
	componentId: 'health',

	value: undefined,
	max: undefined,

	init: function(entity, data) {
		TLStreamedEntityComponent.prototype.init.call(this, entity, data);

		this._actionCallbacks = {
			set: this.setClient
		};

		if (data === undefined || data.max === undefined) {
			this.log('Init parameters not provided for Health.', 'error');
			return;
		}

		// Take the maximum health value as a parameter
		this.max = data.max;
		// Health always starts at the maximum value
		this.value = this.max;
	},

	increase: function(amount) {
		this.setServer(this.value + amount);
	},

	decrease: function(amount) {
		this.setServer(this.value - amount);
	},

	set: function(newValue) {
		this.value = newValue;
	},

	setClient: function(action) {
		this.set(action.data);
	},

	setServer: function(newValue) {
		this.set(newValue);
		this.pushAction("set", this.value);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Health;
}