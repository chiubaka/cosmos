/**
 * Subclass of the {@link Element} class. An IronPlatingBlock is the most basic armor
 * block.
 * @class
 * @typedef {Armor} IronPlatingBlock
 * @namespace
 */
var IronPlatingBlock = Armor.extend({
	classId: 'IronPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "IronPlating.png";
			this.backgroundColor = 0x646464;
			this.borderColor = 0x505050;
			this.textureBackground = "rgb(100, 100, 100)";
			this.textureOutline = "rgb(80, 80, 80)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = IronPlatingBlock; }
