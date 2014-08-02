/**
* Subclass of the {@link Element} class.
* @class
* @typedef {KryptoniteBlock}
* @namespace
* @todo Use this to craft things.
*/
var KryptoniteBlock = Element.extend({
	classId: 'KryptoniteBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x9FF500;
			this.borderColor = 0x6FA700;
			this.backgroundAlpha = 0.8;
			this.textureBackground = "rgba(159, 245, 0, 0.8)";
			this.textureOutline = "rgb(111, 167, 0)";
		}

		Element.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptoniteBlock; }
