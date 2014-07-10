/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {CarbonBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var CarbonBlock = Element.extend({
	classId: 'CarbonBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(40, 40, 40)";
			this.textureOutline = "rgb(80, 80, 80)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CarbonBlock; }
