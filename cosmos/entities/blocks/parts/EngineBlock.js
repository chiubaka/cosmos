/**
 * The engine block provides thrust for your ship.
 * Having more engine blocks allows you to (1) accelerate more rapidly and (2) increase your maximum speed.
 */
var EngineBlock = Part.extend({
	classId: 'EngineBlock',

	init: function () {
		Part.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.svgs.engine;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = EngineBlock; }
