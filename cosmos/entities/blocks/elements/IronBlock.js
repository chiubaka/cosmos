/**
 * Subclass of the {@link Element} class. An IronBlock is a basic element.
 * @class
 * @typedef {IronBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var IronBlock = Element.extend({
	classId: 'IronBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xC8C8C8;
			this.borderColor = 0xD2D2D2;
			this.textureBackground = "rgb(200, 200, 200)";
			this.textureOutline = "rgb(210, 210, 210)";
		}

		Element.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
