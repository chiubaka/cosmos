/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {CarbonBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var CarbonBlock = Resource.extend({
	classId: 'CarbonBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x282828;
			this.borderColor = 0x505050;
			this.textureBackground = "rgb(40, 40, 40)";
			this.textureOutline = "rgb(80, 80, 80)";
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CarbonBlock;
}