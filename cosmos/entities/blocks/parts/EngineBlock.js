var EngineBlock = Part.extend({
	classId: 'EngineBlock',

	MAX_HP: 40,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.svgs.engine;
		}
	},

	onAdded: function() {
		if (!ige.isServer && this.blockGrid().classId() === 'Player') {
			this.addEffect(NetworkUtils.effect('engineParticles', this));
		}
	},

	onRemove: function() {
		if (!ige.isServer && this.blockGrid().classId() === 'Player') {
			this.removeEffect(NetworkUtils.effect('engineParticles', this));
		}
	},

	addEffect: function(effect) {
		Part.prototype.addEffect.call(this, effect);

		switch (effect.type) {
			case 'engineParticles':
				this._addEngineParticlesEffect();
				break;
		}
	},

	_addEngineParticlesEffect: function() {
		this._effects['engineParticles'] = new IgeParticleEmitter()
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
			// Move the particle emitter to the bottom of the ship
			.translateTo(0, Block.HEIGHT * this.numRows(), 0)
			.mount(this.effectsMount())
			// Mount the emitter to the ship
			.start();
	},

	_removeEngineParticlesEffect: function() {
		if (this._effects['engineParticles'] !== undefined) {
			this._effects['engineParticles'].destroy();
			delete this._effects['engineParticles'];
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = EngineBlock; }
