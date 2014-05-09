var CarbonBlock = Element.extend({
	classId: 'CarbonBlock',

	init: function () {
		Element.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(40, 40, 40)";
			this.textureOutline = "rgb(80, 80, 80)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CarbonBlock; }
