/**
 * Subclass of the {@link Part} class. PowerBlocks provide power to electrically powered components like the mining
 * laser.
 * @class
 * @typedef {PowerBlock}
 * @namespace
 * @todo Right now power blocks don't do anything. They should be necessary for powering lasers.
 */
var PowerBlock = Part.extend({
	classId: 'PowerBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = 'Reactor.png';
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PowerBlock; }
