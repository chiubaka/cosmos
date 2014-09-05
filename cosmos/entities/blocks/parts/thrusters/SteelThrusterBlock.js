var SteelThrusterBlock = ThrusterBlock.extend({
	classId: 'SteelThrusterBlock',

	init: function(data) {
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.iconFrame = "HAV3200ThrusterArray.png";
		}

		ThrusterBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelThrusterBlock; }
