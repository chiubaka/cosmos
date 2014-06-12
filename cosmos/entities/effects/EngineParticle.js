/**
 * Subclass of the {@link IgeParticle} class. Defines the what the particles emitted by {@link EngineBlock}s should
 * look like.
 * @class
 * @typedef {EngineParticle}
 * @namespace
 */
var EngineParticle = IgeParticle.extend({
	classId: 'EngineParticle',

	/**
	 * Overrides the superclass color value to change the color of the particles.
	 * This is a light blue color.
	 * @type {string}
	 * @memberof EngineParticle
	 * @private
	 * @instance
	 */
	_color: '#ccffff',

	init: function(emitter) {
		this._emitter = emitter;
		IgeParticle.prototype.init.call(this);

		this.texture(ige.client.textures.rectangleTexture)
			.width(10)
			.height(10)
	},

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = EngineParticle; }
