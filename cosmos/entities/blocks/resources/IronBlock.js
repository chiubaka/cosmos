/**
 * Subclass of the {@link Element} class. An IronBlock is a basic element.
 * @class
 * @typedef {IronBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var IronBlock = Resource.extend({
	classId: 'IronBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x646464;
			this.borderColor = 0x6E6E6E;
			this.textureBackground = "rgb(100, 100, 100)";
			this.textureOutline = "rgb(110, 110, 110)";
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = IronBlock;
}
