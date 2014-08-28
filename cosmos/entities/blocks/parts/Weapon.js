/**
 * Subclass of the {@link Part}. A Weapon is an abstract super class for all {@link Block} types that can be used to
 * deal damage to other {@link Block}s. (e.g. {@link MiningLaserBlock}).
 *
 * Components: DamageComponent
 * @class
 * @typedef {Weapon}
 * @namespace
 */
var Weapon = Part.extend({
	classId: 'Weapon',

	init: function(data) {
		Part.prototype.init.call(this, data);
		// TODO: Determine dps value based on subclass

		if (DamageSources[this.classId()]) {
			this.addComponent(DamageSource, DamageSources[this.classId()]);
		}
	},

	fireClient: function(targetLoc) {
		IgeClass.abstractMethodError('fireClient');
	},

	fireServer: function(data) {
		IgeClass.abstractMethodError('fireServer');
	}
});

Weapon.startCooldown = function(data) {
	var weapon = ige.$(data.id);
	if (!weapon) {
		console.warn("Weapon#startCooldown: called with invalid weapon id: " + data.id);
		return;
	}

	console.log("Weapon#startCooldown: " + weapon.classId());
};

Weapon.endCooldown = function(data) {
	var weapon = ige.$(data.id);
	if (!weapon) {
		console.warn("Weapon#endCooldown: called with invalid weapon id: " + data.id);
		return;
	}

	console.log("Weapon#endCooldown: " + weapon.classId());
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Weapon; }
