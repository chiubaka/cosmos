var KryptoniteThrusterBlock = ThrusterBlock.extend({
	classId: 'KryptoniteThrusterBlock',

	init: function(data) {
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.iconFrame = "HXV4600FusionRelayThruster.png";
		}

		ThrusterBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptoniteThrusterBlock; }
