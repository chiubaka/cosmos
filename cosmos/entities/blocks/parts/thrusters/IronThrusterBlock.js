var IronThrusterBlock = ThrusterBlock.extend({
	classId: 'IronThrusterBlock',

	init: function(data) {
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.iconFrame = "DaceloManeuveringThruster.png";
			this.backgroundColor = 0x404040;
			this.borderColor = 0xFF4E00;
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.thruster;
		}

		ThrusterBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronThrusterBlock; }
