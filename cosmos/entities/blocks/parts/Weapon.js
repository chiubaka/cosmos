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

	DESCRIPTION: 'A weapon block which can deal damage to other blocks.',

	init: function(data) {
		Part.prototype.init.call(this, data);
		// TODO: Determine dps value based on subclass
		this.addComponent(DamageSourceComponent, {dps: 10});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Weapon; }
