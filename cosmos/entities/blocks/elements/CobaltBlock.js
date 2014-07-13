/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {CobaltBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var CobaltBlock = Element.extend({
	classId: 'CobaltBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(0, 71, 171)";
			this.textureOutline = "rgb(0, 0, 128)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CobaltBlock; }
