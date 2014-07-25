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
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(201, 201, 201)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = IronPlatingBlock; }
