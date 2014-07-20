/**
 * Subclass of the {@link Part} class. PowerBlocks provide power to electrically powered components like the mining
 * laser.
 * @class
 * @typedef {PowerBlock}
 * @namespace
 * @todo Right now power blocks don't do anything. They should be necessary for powering mining lasers.
 */
var PowerBlock = Part.extend({
	classId: 'PowerBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xF2F2F2;
			this.borderColor = 0xFFBE0D;
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(255, 190, 13)";
			this.textureSvg = ige.client.textures.power;
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PowerBlock; }
