var Thrust = IgeClass.extend({
	classId: 'Thrust',
	componentId: 'thrust',

	value: undefined,

	init: function(entity, data) {
		if (data === undefined || data.value === undefined) {
			this.log('Init parameters not provided for Thrust.', 'error');
			return;
		}

		this.value = data.value;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Thrust; }
