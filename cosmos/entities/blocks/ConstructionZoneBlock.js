var ConstructionZoneBlock = Block.extend({
	classId: 'ConstructionZoneBlock',

	init: function () {
		Block.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(3,131,255)";
			this.textureOutline = "rgb(204,255,255)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ConstructionZoneBlock; }
