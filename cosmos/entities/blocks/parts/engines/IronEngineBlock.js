var IronEngineBlock = EngineBlock.extend({
	classId: 'IronEngineBlock',

	init: function (data) {
		// Add the thrust component to all Engine blocks.
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.backgroundColor = 0x404040;
			this.borderColor = 0xFF4E00;
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.engine;
		}

		EngineBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronEngineBlock; }
