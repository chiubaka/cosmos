var IronBlock = Element.extend({
	classId: 'IronBlock',

	init: function () {
		Element.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(200, 200, 200)";
			this.textureOutline = "rgb(210, 210, 210)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
