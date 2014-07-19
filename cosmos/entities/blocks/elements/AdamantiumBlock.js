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
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(14, 129, 24)";
			this.textureOutline = "rgb(20, 100, 20)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AdamantiumBlock; }
