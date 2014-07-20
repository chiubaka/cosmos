/**
* Subclass of the {@link Element} class.
* @class
* @typedef {AdamantiumBlock}
* @namespace
* @todo Use this to craft things.
*/
var AdamantiumBlock = Element.extend({
	classId: 'AdamantiumBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x0E8118;
			this.borderColor = 0x146414;
			this.textureBackground = "rgb(14, 129, 24)";
			this.textureOutline = "rgb(20, 100, 20)";
		}

		Element.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AdamantiumBlock; }
