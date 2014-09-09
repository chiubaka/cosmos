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
	},

	/*
	 * Override the Block's _mouseOverHandler to do nothing.
	 * This is because you can't deconstruct a Bridge Block, so
	 * it would be misleading for it to show a deconstruction indicator
	 * when you mouse over it.
	 */
	_mouseOverHandler: function() {
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BridgeBlock; }
