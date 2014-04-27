var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	init: function () {
		IgeEntity.prototype.init.call(this);

		// Correct for texture rotation
		this.rotateTo(0, 0, Math.radians(90))

		if (!ige.isServer) {
			this.texture(ige.client.textures.laserBeamTexture)

				//.rotateTo(0, 0, Math.radians(90))
				.width(300)
					// No need for server to be concerned with animation
				.newTween();
		}
	},

	newTween: function () {
		var self = this;
		var restAngle = Math.radians(90);
		var sweepAngle = Math.radians(75);
		
		this._rotate.tween()
			.stepTo({z: restAngle + sweepAngle/2}, 1000, 'inOutCubic')
			.stepTo({z: restAngle - sweepAngle/2}, 1000, 'inOutCubic')
			//.stepTo({z: Math.radians(90)}, 500, 'outQuad')
			.repeatMode (1, -1)
			.start();

		return this;

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
