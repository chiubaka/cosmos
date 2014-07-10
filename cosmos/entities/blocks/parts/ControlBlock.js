/**
 * Subclass of the {@link Part} class. The ControlBlock allows you to control your ship.
 * @class
 * @typedef {ControlBlock}
 * @namespace
 * @todo When you lose your control block you should lose control of your ship.
 */
var ControlBlock = Part.extend({
	classId: 'ControlBlock',

	/**
	 * The maximum HP for a {@link ControlBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof ControlBlock
	 * @instance
	 */
	MAX_HP: 45,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(8, 143, 255)";
			this.textureSvg = ige.client.textures.control;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ControlBlock; }
