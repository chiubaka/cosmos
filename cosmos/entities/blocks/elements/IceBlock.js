var IceBlock = Element.extend({
	classId: 'IceBlock',

	init: function () {
		Element.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgba(63, 175, 221, 0.3)";
			this.textureOutline = "rgba(129, 206, 226, 0.3)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IceBlock; }
