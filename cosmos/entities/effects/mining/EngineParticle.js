var EngineParticle = IgeParticle.extend({
	classId: 'EngineParticle',

	// Light blue color
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
