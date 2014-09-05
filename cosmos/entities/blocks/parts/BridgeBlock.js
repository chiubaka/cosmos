/**
 * Subclass of the {@link Part} class. The BridgeBlock allows you to control your ship.
 * @class
 * @typedef {BridgeBlock}
 * @namespace
 * @todo When you lose your control block you should lose control of your ship.
 */
var BridgeBlock = Part.extend({
	classId: 'BridgeBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = 'CommandModule.png';
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BridgeBlock; }
