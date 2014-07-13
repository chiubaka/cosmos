var Health = IgeClass.extend({
	classId: 'Health',
	componentId: 'health',

	value: undefined,
	max: undefined,

	init: function(entity, data) {
		if (data === undefined || data.max === undefined) {
			this.log('Init parameters not provided for health component.', 'error');
			return;
		}

		// Take the maximum health value as a parameter
		this.max = data.max;
		// Health always starts at the maximum value
		this.value = this.max;
	},

	increase: function(amount) {
		this.value += amount;
	},

	decrease: function(amount) {
		this.value -= amount;
	},

	set: function(newValue) {
		this.value = newValue;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Health; }