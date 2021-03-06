/**
 * Subclass of the {@link Part} class.
 * The {@link MiningLaserBlock} class represents a block that can mine blocks. Better lasers will allow you to
 * (1) mine better blocks and (2) mine faster. If you don't have a laser you can't mine.
 * Also, note that lasers are currently the only weapon for combat.
 * @class
 * @typedef {MiningLaserBlock}
 * @namespace
 */
var MiningLaserBlock = Laser.extend({
	classId: 'MiningLaserBlock',

	init: function(data) {
		data = {MAX_HP: this.MAX_HP};

		if (!ige.isServer) {
			this.iconFrame = 'RedLaser.png';
		}

		Laser.prototype.init.call(this, data);
	},

	/**
	 * Overrides superclass addEffect function. The laser supports effects for adding the laser graphic
	 * between this {@link Block} and a target {@link Block}. This function handles adding effects to the
	 * {@link MiningLaserBlock}
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the laser effect.
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

	onRemove: function() {
		Laser.prototype.onRemove.call(this);

		if (ige.client && this._effects["miningLaser"]) {
			this._removeMiningLaserEffect(this._effects["miningLaser"]);
		}
	},

	/**
	 * Overrides superclass removeEffect function. Removes effects from the {@link MiningLaserBlock}.
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the laser effect.
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
	 * Handles adding the laser effect to this {@link MiningLaserBlock}.
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the laser effect.
	 * @memberof MiningLaserBlock
	 * @private
	 * @instance
	 */
	_addMiningLaserEffect: function(effect) {
		var targetBlockGrid = ige.$(effect.targetBlock.blockGridId);
		var targetBlock = targetBlockGrid.get(new IgePoint2d(effect.targetBlock.col, effect.targetBlock.row))[0];

		if (this.laserBeam !== undefined) {
			this.laserBeam.destroy();
		}

		this._effects['miningLaser'] = effect;

		this.laserBeam = new LaserBeam()
			.setSource(this)
			.setTarget(targetBlock);

		this._mountEffect(this.laserBeam, true);

		var targetEffect = NetworkUtils.effect('miningParticles');
		targetEffect.sourceBlock = effect.targetBlock;

		targetBlock.addEffect(targetEffect);
	},

	/**
	 * Removes the laser effect from this {@link MiningLaserBlock}.
	 * @param effect {Object}  An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the laser effect.
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

		delete this._effects['miningLaser'];

		var targetBlock = targetBlockGrid.get(new IgePoint2d(effect.targetBlock.col, effect.targetBlock.row))[0];

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
