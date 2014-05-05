var LaserParticle = IgeParticle.extend({
	classId: 'LaserParticle',

	// Orange color
	_color: '#ff5a00',

	init: function(emitter) {
		this._emitter = emitter;
		IgeParticle.prototype.init.call(this);


		this.texture(ige.client.textures.rectangleTexture)
			.width(7)
			.height(7)
	},

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserParticle; }
