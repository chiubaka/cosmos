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
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(100, 100, 100)";
			this.textureOutline = "rgb(110, 110, 110)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
