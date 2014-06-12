/**
 * The control block allows you to control your ship.
 * TODO when you lose your control block you should lose control of your ship.
 * @class
 * @namespace
 */
var ControlBlock = Part.extend({
	classId: 'ControlBlock',

	MAX_HP: 45,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(8, 143, 255)";
			this.textureSvg = ige.client.svgs.control;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ControlBlock; }
