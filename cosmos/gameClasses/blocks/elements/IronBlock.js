var IronBlock = Element.extend({
	classId: 'IronBlock',

	init: function () {
		Element.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(252, 202, 202)";
			this.textureOutline = "rgb(28, 28, 28)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
