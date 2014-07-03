var DamageSourceComponent = IgeClass.extend({
	classId: 'DamageComponent',
	componentId: 'damageSource',

	dps: undefined,

	init: function(entity, data) {
		if (data === undefined || data.dps === undefined) {
			this.log('Init parameters not provided for health component.', 'error');
			return;
		}

		// Take the dps as a parameter
		this.dps = data.dps;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DamageSourceComponent; }