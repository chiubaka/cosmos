var Laser = Weapon.extend({
	classId: 'Laser',

	init: function(data) {
		Weapon.prototype.init.call(this, data);
	},

	fireClient: function(targetLoc) {
		var data = {
			id: this.id(),
			targetLoc: targetLoc
		};

		ige.network.send('fire', data);
	},

	fireServer: function(data) {
		console.log('Laser#fireServer');

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Laser;
}
