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
			this.textureBackground = "rgb(200, 200, 200)";
			this.textureOutline = "rgb(210, 210, 210)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
