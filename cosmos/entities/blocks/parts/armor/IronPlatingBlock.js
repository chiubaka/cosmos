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
			this.backgroundColor = 0xD9D9D9;
			this.borderColor = 0xC9C9C9;
			this.textureBackground = "rgb(217, 217, 217)";
			this.textureOutline = "rgb(201, 201, 201)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = IronPlatingBlock; }
