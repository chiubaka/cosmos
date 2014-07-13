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
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(255, 190, 13)";
			this.textureSvg = ige.client.textures.power;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PowerBlock; }
