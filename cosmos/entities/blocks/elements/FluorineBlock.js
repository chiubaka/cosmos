/**
 * Subclass of the {@link Element} class.
 * @class
 * @typedef {FluorineBlock}
 * @namespace
 * @todo Use this to craft things.
 */
var FluorineBlock = Element.extend({
	classId: 'FluorineBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(85, 26, 140)";
			this.textureOutline = "rgb(38, 38, 38)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FluorineBlock; }
