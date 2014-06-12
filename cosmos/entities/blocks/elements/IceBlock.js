/**
 * The ice block is special in that it provides little to no nutritional value but it can be mined very easily.
 * @class
 * @namespace
 */
var IceBlock = Element.extend({
	classId: 'IceBlock',

	MAX_HP: 8,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgba(63, 175, 221, 0.3)";
			this.textureOutline = "rgb(129, 206, 226)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IceBlock; }
