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
			this.textureBackground = "rgb(110, 110, 110)";
			this.textureOutline = "rgb(80, 80, 80)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelBlock; }
