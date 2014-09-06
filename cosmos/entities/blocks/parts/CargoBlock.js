/**
 * Subclass of the {@link Part} class. The cargo block is a ship part which will hold cargo.
 * The current plan is to have each cargo block allow you to hold one more type of block in your inventory. Each cargo
 * slot will also hold a maximum number of {@link Block}s.
 * @class
 * @typedef {CargoBlock}
 * @namespace
 */
var CargoBlock = Part.extend({
	classId: 'CargoBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xF2F2F2;
			this.borderColor = 0x262626;
			this.iconFrame = 'cargo.svg';
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(38, 38, 38)";
			this.textureSvg = ige.client.textures.cargo;
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CargoBlock; }
