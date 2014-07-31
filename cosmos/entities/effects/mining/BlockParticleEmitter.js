/**
 * Subclass of the {@link IgeParticleEmitter}. Customizes the particle emitter to output the particle effects that are
 * displayed on a {@link Block} when a {@link Player} mines a {@link Block}.
 * @class
 * @typedef {BlockParticleEmitter}
 * @namespace
 * @todo Should probably rename this to something sensible
 */
var BlockParticleEmitter = IgeParticleEmitter.extend({
	classId: 'BlockParticleEmitter',

	init: function (emitter) {
		IgeParticleEmitter.prototype.init.call(this);

		if (!ige.isServer) {
			// Set the particle entity to generate for each particle
			this.particle(LaserParticle)
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
				.particleMountTarget(ige.client.effectsScene)
				.start()
		}
	},

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = BlockParticleEmitter; }
