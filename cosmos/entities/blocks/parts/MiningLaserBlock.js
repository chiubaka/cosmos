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

	_addMiningLaserEffect: function(effect) {
		console.log('MiningLaserBlock#_addMiningLaserEffect');
		var targetBlockGrid = ige.$(effect.targetBlock.blockGridId);
		var targetBlock = targetBlockGrid.get(effect.targetBlock.row, effect.targetBlock.col);

		targetBlockGrid.createEffectsMount(targetBlock);
		// TODO: Actually add the mining laser.

		var targetEffect = NetworkUtils.effect('miningParticles');
		targetEffect.sourceBlock = effect.targetBlock;

		targetBlock.addEffect(targetEffect);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MiningLaserBlock; }
