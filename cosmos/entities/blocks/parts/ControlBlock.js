/**
 * The control block allows you to control your ship.
 * TODO when you lose your control block you should lose control of your ship.
 */
var ControlBlock = Part.extend({
	classId: 'ControlBlock',

	init: function () {
		Part.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(8, 143, 255)";
			this.textureSvg = ige.client.svgs.control;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ControlBlock; }
