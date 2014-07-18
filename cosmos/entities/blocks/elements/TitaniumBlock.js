/**
* Subclass of the {@link Element} class.
* @class
* @typedef {TitaniumBlock}
* @namespace
* @todo Use this to craft things.
*/
var TitaniumBlock = Element.extend({
	classId: 'TitaniumBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(220, 220, 220)";
			this.textureOutline = "rgb(200, 200, 200)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TitaniumBlock; }
