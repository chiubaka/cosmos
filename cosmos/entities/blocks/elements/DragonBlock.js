/**
* Subclass of the {@link Element} class.
* @class
* @typedef {DragonBlock}
* @namespace
* @todo Use this to craft things.
*/
var DragonBlock = Element.extend({
	classId: 'DragonBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x770000;
			this.borderColor = 0x780000;
			this.textureBackground = "rgb(119, 0, 0)";
			this.textureOutline = "rgb(120, 0, 0)";
		}

		Element.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonBlock; }
