/**
 * Subclass of the {@link Element} class. The ice block is special in that it provides little to no nutritional
 * value but it can be mined very easily.
 * @class
 * @typedef {IceBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var IceBlock = Resource.extend({
	classId: 'IceBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x3FAFDD;
			this.borderColor = 0x81CEE2;
			this.backgroundAlpha = 0.3;
			this.textureBackground = "rgba(63, 175, 221, 0.3)";
			this.textureOutline = "rgb(129, 206, 226)";
		}
		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = IceBlock;
}
