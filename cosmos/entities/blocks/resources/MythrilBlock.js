/**
* Subclass of the {@link Element} class. An MythrilBlock is a basic element.
* @class
* @typedef {MythrilBlock}
* @namespace
* @todo Use this to craft things.
*/
var MythrilBlock = Resource.extend({
	classId: 'MythrilBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xC8C8FF;
			this.borderColor = 0xD2D2FF;
			this.textureBackground = "rgb(200, 200, 255)";
			this.textureOutline = "rgb(210, 210, 255)";
		}

		Resource.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MythrilBlock;
}
