/**
 * Subclass of the {@link Part} class. The BridgeBlock allows you to control your ship.
 * @class
 * @typedef {BridgeBlock}
 * @namespace
 * @todo When you lose your control block you should lose control of your ship.
 */
var BridgeBlock = Part.extend({
	classId: 'BridgeBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xF2F2F2;
			this.borderColor = 0x088FFF;
			this.iconFrame = 'playerctrl';
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(8, 143, 255)";
			this.textureSvg = ige.client.textures.control;
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BridgeBlock; }
