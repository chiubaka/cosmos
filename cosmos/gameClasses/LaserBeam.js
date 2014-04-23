var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.texture(ige.client.textures.laserBeamTexture);
		}
	},

	newTween: function () {
		var self = this;

		this._rotate.tween()
			.stepTo({z: Math.radians(135)}, 1000, 'inOutCubic')
			.stepTo({z: Math.radians(45)}, 1000, 'inOutCubic')
			//.stepTo({z: Math.radians(90)}, 500, 'outQuad')
			.repeatMode (1, -1)

			.afterTween(function () {
				//self.destroy()
			})
			.start();

		return this;

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
