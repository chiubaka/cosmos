/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {FluorineBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var FluorineBlock = Resource.extend({
	classId: 'FluorineBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x551A8C;
			this.borderColor = 0x262626;
			this.textureBackground = "rgb(85, 26, 140)";
			this.textureOutline = "rgb(38, 38, 38)";
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = FluorineBlock;
}
