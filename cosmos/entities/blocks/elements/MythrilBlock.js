/**
* Subclass of the {@link Element} class. An MythrilBlock is a basic element.
* @class
* @typedef {MythrilBlock}
* @namespace
* @todo Use this to craft things.
*/
var MythrilBlock = Element.extend({
	classId: 'MythrilBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(200, 200, 255)";
			this.textureOutline = "rgb(210, 210, 255)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MythrilBlock; }
