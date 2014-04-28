var LaserParticle = IgeParticle.extend({
	classId: 'LaserParticle',

	init: function (emitter) {
		this._emitter = emitter;
		IgeParticle.prototype.init.call(this);


		this.texture(ige.client.textures.rectangleTexture)
			.width(5)
			.height(5)
			//.layer(LAYER_FOREGROUND)
	},

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserParticle; }
