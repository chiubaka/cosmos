var DragonBreathEngineBlock = EngineBlock.extend({
	classId: 'DragonBreathEngineBlock',

	init: function (data) {
		// Add the thrust component to all Engine blocks.
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.iconFrame = "ZentrumFusionEngine.png";
		}

		EngineBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonBreathEngineBlock; }
