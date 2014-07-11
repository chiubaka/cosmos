var DragonBreathEngineBlock = EngineBlock.extend({
	classId: 'DragonBreathEngineBlock',

	init: function (data) {
		EngineBlock.prototype.init.call(this, data);

		// Add the thrust component to all Engine blocks.
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.textureBackground = "rgb(139, 0, 0)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.engine;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonBreathEngineBlock; }
