/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {CobaltBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var CobaltBlock = Resource.extend({
	classId: 'CobaltBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x0047AB;
			this.borderColor = 0x000080;
			this.textureBackground = "rgb(0, 71, 171)";
			this.textureOutline = "rgb(0, 0, 128)";
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CobaltBlock;
}
