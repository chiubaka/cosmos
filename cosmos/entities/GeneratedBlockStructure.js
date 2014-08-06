var GeneratedBlockStructure = BlockStructure.extend({
	classId: 'GeneratedBlockStructure',

	_maxNumBlocks: undefined,
	_blockDistribution: undefined,
	_symmetric: undefined,

	init: function(data) {
		BlockStructure.prototype.init.call(this, data);

		if (data === undefined) {
			data = {};
		}

		this._maxNumBlocks = data.maxNumBlocks;
		this._blockDistribution = data.blockDistribution;
		this._symmetric = data.symmetric;

		if (ige.isServer) {
			this.addComponent(RespawnableComponent, {
				minRespawnTime: GeneratedBlockStructure.MIN_RESPAWN_TIME,
				maxRespawnTime: GeneratedBlockStructure.MAX_RESPAWN_TIME,
				respawnAction: GameInit.spawnStructure.bind(
					GameInit,
					this._maxNumBlocks,
					this._blockDistribution,
					this._symmetric
				)
			});
		}
	},

	remove: function(row, col) {
		BlockStructure.prototype.remove.call(this, row, col);
		if (ige.isServer) {
			this.respawn.resetTimeout();
		}
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
GeneratedBlockStructure.MAX_RESPAWN_TIME = 60 * 1000 * 15; // 15 minutes


if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GeneratedBlockStructure; }
