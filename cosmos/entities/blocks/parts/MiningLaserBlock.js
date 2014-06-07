var MiningLaserBlock = Part.extend({
	classId: 'MiningLaserBlock',

	MAX_HP: 50,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(255, 0, 0)";
			this.textureSvg = ige.client.svgs.miningLaser;
		}
	},

	addEffect: function(effect) {
		console.log("MiningLaserBlock#addEffect: " + effect.type);
		switch (effect.type) {
			case 'miningLaser':
				this._addMiningLaserEffect(effect);
				break;
			default:
				Part.prototype.addEffect.call(this, effect);
				break;
		}
	},

	removeEffect: function(effect) {

		switch (effect.type) {
			case 'miningLaser':
				this._removeMiningLaserEffect(effect);
				break;
		}

		Part.prototype.removeEffect.call(this, effect);
	},

	_addMiningLaserEffect: function(effect) {
		var targetBlockGrid = ige.$(effect.targetBlock.blockGridId);
		var targetBlock = targetBlockGrid.get(effect.targetBlock.row, effect.targetBlock.col);

		targetBlockGrid.createEffectsMount(targetBlock);

		if (this.laserBeam !== undefined) {
			this.laserBeam.destroy();
		}

		this.laserBeam = new LaserBeam()
			.setTarget(effect.targetBlock.blockGridId, effect.targetBlock.row, effect.targetBlock.col)
			.mount(this.effectsMount());

		var targetEffect = NetworkUtils.effect('miningParticles');
		targetEffect.sourceBlock = effect.targetBlock;

		targetBlock.addEffect(targetEffect);
	},

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
