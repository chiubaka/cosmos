var DamageSource = IgeClass.extend({
	classId: 'DamageSource',
	componentId: 'damageSource',

	cooldown: undefined,
	damage: undefined,
	duration: undefined,
	isFiring: undefined,
	onCooldown: undefined,
	range: undefined,
	target: undefined,

	init: function(entity, data) {
		if (data === undefined || data.cooldown === undefined || data.damage === undefined
			|| data.duration === undefined || data.range === undefined ) {
			this.log('Init parameters not provided for DamageSource.', 'error');
			return;
		}

		this.cooldown = data.cooldown;
		this.damage = data.damage;
		this.duration = data.duration;
		this.range = data.range;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DamageSource; }
