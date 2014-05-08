var CobaltBlock = Element.extend({
	classId: 'CobaltBlock',

	init: function () {
		Element.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(42, 42, 242)";
			this.textureOutline = "rgb(38, 38, 38)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CobaltBlock; }
