var IronBlock = Element.extend({
	classId: 'IronBlock',

	MAX_HP: 25,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(200, 200, 200)";
			this.textureOutline = "rgb(210, 210, 210)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IronBlock; }
