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
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = IronPlatingBlock; }
