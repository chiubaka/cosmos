/**
* Subclass of the {@link Element} class.
* @class
* @typedef {SteelBlock}
* @namespace
* @todo Use this to craft things.
*/
var SteelBlock = Element.extend({
	classId: 'SteelBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(114, 114, 114)";
			this.textureOutline = "rgb(100, 100, 100)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelBlock; }
