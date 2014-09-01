var MineCap = Cap.extend({
	classId: 'MineCap',
	componentId: 'mineCap',

	active: undefined,
	/**
	 * Used to determine whether or not the cooldown has already been activated. Useful for
	 * optimizing streamSync so that startCooldown() only does work once per stream of packets.
	 */
	cooldownActivated: undefined,

	init: function() {
		Cap.prototype.init.call(this, $('#cap-bar'), 'mine-cap', undefined, 'Mine');

		$('#mine-cap').append('<div class="background"></div>');
		$('#mine-cap').append('<div class="icon"></div>');

		ige.emit('cosmos:hud.bottomToolbar.capBar.subcomponent.loaded', this);

		this.cooldownActivated = true;
	},

	startCooldown: function(weapon) {
		if (this.cooldownActivated) {
			return;
		}

		$('#mine-cap .background').stop();

		$('#mine-cap .background').width('0%');

		$('#mine-cap .background').animate({width: "100%"}, weapon.damageSource.cooldown);

		this.cooldownActivated = true;
	}
});

MineCap.COOLDOWN_INTERVAL_MS = 40;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MineCap;
}