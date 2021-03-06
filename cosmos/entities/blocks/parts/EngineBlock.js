/**
 * Subclass of the {@link Part} class. The {@link EngineBlock} class represents a {@link Block} that propels a ship.
 * Having more engine blocks allows you to (1) accelerate more rapidly and (2) travel at a greater maximum speed.
 * @class
 * @typedef {EngineBlock}
 * @namespace
 */
var EngineBlock = Part.extend({
	classId: 'EngineBlock',

	init: function (data) {
		Part.prototype.init.call(this, data);
	},

	/**
	 * Overrides the superclass onAdded function. Makes sure that all engines that are on players ships have particle
	 * effects when they are added to a {@link Player} {@link BlockGrid}.
	 * @memberof EngineBlock
	 * @instance
	 */
	onPut: function() {
		Part.prototype.onPut.call(this);

		if (!ige.isServer && this.blockGrid().classId() === 'Ship') {
			this.addEffect(NetworkUtils.effect('engineParticles', this));
		}
	},

	/**
	 * Overrides the superclass onRemoved function. Makes sure that engine particle effects are properly removed and
	 * cleaned up when this {@link EngineBlock} is removed from a {@link Player}.
	 * @memberof EngineBlock
	 * @instance
	 */
	onRemove: function() {
		if (!ige.isServer && this.blockGrid().classId() === 'Ship') {
			this.removeEffect(NetworkUtils.effect('engineParticles', this));
		}

		Part.prototype.onRemove.call(this);
	},

	/**
	 * Overrides the superclass addEffect function. The EngineBlock supports engine particles.
	 * @param effect {Object} An effect object, which stores the effect type and two
	 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
	 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
	 * the laser effect.
	 * @memberof EngineBlock
	 * @instance
	 */
	addEffect: function(effect) {
		Part.prototype.addEffect.call(this, effect);

		switch (effect.type) {
			case 'engineParticles':
				//this._addEngineParticlesEffect();
				break;
		}
	},

	/**
	 * Handles adding the engine particle effect to this {@link EngineBlock}
	 * @memberof EngineBlock
	 * @private
	 * @instance
	 */
	_addEngineParticlesEffect: function() {
		this._effects.engineParticles = new IgeParticleEmitter()
			// Set the particle entity to generate for each particle
			.particle(EngineParticle)
			// Set particle life to 300ms
			.lifeBase(300)
			// Set output to 60 particles a second (1000ms)
			.quantityBase(60)
			.quantityTimespan(1000)
			// Set the particle's death opacity to zero so it fades out as it's lifespan runs out
			.deathOpacityBase(0)
			// Set velocity vector to y = 0.05, with variance values
			//.velocityVector(new IgePoint3d(0, 0.05, 0), new IgePoint3d(-0.04, 0.05, 0), new IgePoint3d(0.04, 0.15, 0))
			.translateVarianceY(-10, 10)
			.translateVarianceX(-10, 10)
			// Mount new particles to the object scene
			.particleMountTarget(ige.client.spaceGameScene)
			.start();
		this._mountEffect(this._effects.engineParticles, false);
	},

	/**
	 * Handles removing the engine particle effect from this {@link EngineBlock}
	 * @memberof EngineBlock
	 * @private
	 * @instance
	 */
	_removeEngineParticlesEffect: function() {
		if (this._effects.engineParticles !== undefined) {
			this._effects.engineParticles.destroy();
			delete this._effects.engineParticles;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = EngineBlock; }
