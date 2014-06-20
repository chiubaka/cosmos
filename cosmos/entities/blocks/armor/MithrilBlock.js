var MithrilBlock = Armor.extend({
	classId: 'MithrilBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(140, 165, 217)";
			this.textureOutline = "rgb(120, 145, 200)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MithrilBlock; }
