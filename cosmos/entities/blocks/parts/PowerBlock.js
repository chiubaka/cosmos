/**
 * Power blocks provide power to electrically powered components like the mining laser.
 * TODO right now power blocks don't do anything. They should be neccesary for powering mining lasers.
 */
var PowerBlock = Part.extend({
	classId: 'PowerBlock',

	init: function () {
		Part.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(255, 190, 13)";
			this.textureSvg = ige.client.svgs.power;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PowerBlock; }
