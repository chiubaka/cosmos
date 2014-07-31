/**
 * Subclass of the {@link IgeParticle} class. This is the actual particle generated by the ablation of the surface of a
 * block by your laser.
 * It is a small red square.
 * @class
 * @typedef {LaserParticle}
 * @namespace
 */
var LaserParticle = IgeParticle.extend({
	classId: 'LaserParticle',

	/**
	 * Overrides the superclass color value to change the color of the particles.
	 * This is an orange color.
	 * @type {string}
	 * @memberof LaserParticle
	 * @private
	 * @instance
	 */
	_color: '#ff5a00',

	init: function(emitter) {
		this._emitter = emitter;
		IgeParticle.prototype.init.call(this);


		this.texture(ige.client.textures.rectangleTexture)
			.width(7)
			.height(7)

		this.addComponent(ParticleRenderableComponent, {createDisplayObject: function() {
			var particle = new PIXI.Graphics();
			particle.beginFill(0xff5a00);
			particle.drawRect(0, 0, 7, 7);
			particle.endFill();

			return particle;
		}});
	},

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserParticle; }
