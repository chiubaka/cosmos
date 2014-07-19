/**
* Subclass of the {@link Element} class. An RefinedMythrilBlock is a basic element.
* @class
* @typedef {RefinedMythrilBlock}
* @namespace
* @todo Use this to craft things.
*/
var RefinedMythrilBlock = Element.extend({
	classId: 'RefinedMythrilBlock',

	init: function(data) {
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(50, 100, 255)";
			this.textureOutline = "rgb(50, 50, 255)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = RefinedMythrilBlock; }
