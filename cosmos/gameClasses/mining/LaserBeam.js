var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	init: function () {
		IgeEntity.prototype.init.call(this);

		// Correct for texture rotation
		this.rotateTo(0, 0, Math.radians(90))

		// No need for server to be concerned with tweening
		if (!ige.isServer) {
			.width(300)
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
			// From the 1st step, repeat forever
			.repeatMode (1, -1)
			.start();

		return this;

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
