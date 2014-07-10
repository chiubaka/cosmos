/**
 * Subclass of the {@link Block} class. The construction zone is an area around every block grid where players can add
 * blocks. This allows them to 'construct' onto the block grid.
 * The construction zone is only visible to the player when she is in construction mode.
 * @class
 * @typedef {ConstructionZoneBlock}
 * @namespace
 */
var ConstructionZoneBlock = Block.extend({
	classId: 'ConstructionZoneBlock',

	init: function () {
		Block.prototype.init.call(this);

		if (!ige.isServer) {
			// Construction zone texture should take up whole block (no outline)
			this.iconScaleFactor = 1;
			this.textureSvg = ige.client.textures.constructionZone;

		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ConstructionZoneBlock; }
