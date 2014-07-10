/**
 * Subclass of the {@link Part} class.
 * The {@link MiningLaserBlock} class represents a block that can mine blocks. Better mining lasers will allow you to
 * (1) mine better blocks and (2) mine faster. If you don't have a mining laser you can't mine.
 * Also, note that mining lasers are currently the only weapon for combat.
 * @class
 * @typedef {MiningLaserBlock}
 * @namespace
 */
var MiningLaserBlock = Weapon.extend({
	classId: 'MiningLaserBlock',

	/**
	 * The maximum HP for a {@link MiningLaserBlock}. Overrides the superclass MAX_HP value. See {@link Block#MAX_HP}.
	 * @constant {number}
	 * @default
	 * @memberof MiningLaserBlock
	 * @instance
	 */
	MAX_HP: 50,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Weapon.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(208, 63, 44)";
			this.textureSvg = ige.client.svgs.miningLaser;
		}
	},

	/**
	 * Overrides superclass addEffect function. The mining laser supports effects for adding the mining laser graphic
	 * between this {@link Block} and a target {@link Block}. This function handles adding effects to the
	 * {@link MiningLaserBlock}
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the mining laser effect.
	 * @memberof MiningLaserBlock
	 * @instance
	 */
	addEffect: function(effect) {
		// This must be called before anything else. Block#addEffect makes sure that the effects mount exists before
		// adding the effect.
		Part.prototype.addEffect.call(this, effect);

		switch (effect.type) {
			case 'miningLaser':
				this._addMiningLaserEffect(effect);
				break;
		}
	},

	/**
	 * Overrides superclass removeEffect function. Removes effects from the {@link MiningLaserBlock}.
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the mining laser effect.
	 * @memberof MiningLaserBlock
	 * @instance
	 */
	removeEffect: function(effect) {

		switch (effect.type) {
			case 'miningLaser':
				this._removeMiningLaserEffect(effect);
				break;
		}

		// This must be called after everything else. Block#removeEffect makes sure to clean up the effects mount if
		// it is no longer needed.
		Part.prototype.removeEffect.call(this, effect);
	},

	/**
	 * Handles adding the mining laser effect to this {@link MiningLaserBlock}.
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the mining laser effect.
	 * @memberof MiningLaserBlock
	 * @private
	 * @instance
	 */
	_addMiningLaserEffect: function(effect) {
		var targetBlockGrid = ige.$(effect.targetBlock.blockGridId);
		var targetBlock = targetBlockGrid.get(effect.targetBlock.row, effect.targetBlock.col);

		if (this.laserBeam !== undefined) {
			this.laserBeam.destroy();
		}

		this.laserBeam = new LaserBeam()
			.setTarget(effect.targetBlock.blockGridId, effect.targetBlock.row, effect.targetBlock.col)
			.mount(this.effectsMountAbove());

		var targetEffect = NetworkUtils.effect('miningParticles');
		targetEffect.sourceBlock = effect.targetBlock;

		targetBlock.addEffect(targetEffect);
	},

	/**
	 * Removes the mining laser effect from this {@link MiningLaserBlock}.
	 * @param effect {Object}  An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the mining laser effect.
	 * @memberof MiningLaserBlock
	 * @private
	 * @instance
	 */
	_removeMiningLaserEffect: function(effect) {
		if (this.laserBeam !== undefined) {
			this.laserBeam.destroy();
		}

		var targetBlockGrid = ige.$(effect.targetBlock.blockGridId);

		// targetBlockGrid could be undefined if its last Block was just mined off.
		if (targetBlockGrid === undefined) {
			return;
		}

		var targetBlock = targetBlockGrid.get(effect.targetBlock.row, effect.targetBlock.col);

		// targetBlock could be undefined if it has already been removed from the BlockGrid, in which case the
		// mining particle effects have been destroyed anyway!
		if (targetBlock === undefined) {
			return;
		}

		var targetEffect = NetworkUtils.effect('miningParticles');
		targetEffect.sourceBlock = effect.targetBlock;

		targetBlock.removeEffect(targetEffect);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MiningLaserBlock; }
