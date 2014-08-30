var GeneratedBlockStructure = BlockStructure.extend({
	classId: 'GeneratedBlockStructure',

	_numLayers: undefined,
	_blockDistribution: undefined,
	_symmetric: undefined,

	init: function(data) {
		BlockStructure.prototype.init.call(this, data);

		if (data === undefined) {
			data = {};
		}

		this._numLayers = data.numLayers;
		this._blockDistribution = data.blockDistribution;
		this._symmetric = data.symmetric;

		if (ige.isServer) {
			this.physicsBody.fixtureFilter['categoryBits'] =
				GeneratedBlockStructure.BOX2D_CATEGORY_BITS;
			// Collide with everything, except for drops
			this.physicsBody.fixtureFilter['maskBits'] =
				0xffff & ~(1 << Drop.BOX2D_CATEGORY_BITS);

			this.addComponent(RespawnableComponent, {
				minRespawnTime: GeneratedBlockStructure.MIN_RESPAWN_TIME,
				maxRespawnTime: GeneratedBlockStructure.MAX_RESPAWN_TIME,
				respawnAction: GameInit.spawnStructure.bind(
					GameInit,
					this._numLayers,
					this._blockDistribution,
					this._symmetric
				)
			});
		}
	},

	remove: function(loc, width, height) {
		if (ige.isServer) {
			this.respawn.resetTimeout();
		}
		return BlockStructure.prototype.remove.call(this, loc, width, height);
	}
});

/**
 * Minimum time it takes to respawn this structure.
 * @type {number}
 */
GeneratedBlockStructure.MIN_RESPAWN_TIME = 60 * 1000 * 2; // 2 minutes

/**
 * Maximum time it takes to respawn this structure.
 * @type {number}
 */
GeneratedBlockStructure.MAX_RESPAWN_TIME = 60 * 1000 * 52; // 52 minutes

GeneratedBlockStructure.BOX2D_CATEGORY_BITS = 0x0008;


if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GeneratedBlockStructure; }
