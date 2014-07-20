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
		if (!ige.isServer) {
			this.backgroundColor = 0x6E6E6E;
			this.borderColor = 0x505050;
			this.textureBackground = "rgb(110, 110, 110)";
			this.textureOutline = "rgb(80, 80, 80)";
		}

		Element.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelBlock; }
