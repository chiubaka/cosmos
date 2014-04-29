var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	init: function (createData) {
		IgeEntity.prototype.init.call(this);

		// Correct for texture rotation
		this.rotateTo(0, 0, Math.radians(90));

		if (!ige.isServer) {
			this._targetId = createData[0];
			this._targetCol = createData[1];
			this._targetRow = createData[2];

			console.log('id: ' + this._targetId + 'row: ' + this._targetRow + 'col: '
			+ this._targetCol);
		}
	},

	newTween: function () {
		var self = this;
		//var restAngle = Math.radians(90);
		var restAngle = this.rotate().z();
		var sweepAngle = Math.radians(75);
		
		this._rotate.tween()
			.stepTo({z: restAngle + sweepAngle/2}, 1000, 'inOutCubic')
			.stepTo({z: restAngle - sweepAngle/2}, 1000, 'inOutCubic')
			// From the 1st step, repeat forever
			.repeatMode (1, -1)
			.start();

		return this;
	},

	setTarget: function(blockGridId, row, col) {
		this._targetId = blockGridId;
		this._targetCol = row;
		this._targetCol = col;
		return this;
	},


	// Send custom data to client upon creation through network stream
	streamCreateData: function () {
		return [this._targetId, this._targetCol, this._targetCol];
	},

	update: function(ctx) {
		if (!ige.isServer) {
			var player = this.parent();
			var block = ige.$(this._targetId);

			var deltaX = block.worldPosition().x - player.worldPosition().x;
			var deltaY = block.worldPosition().y - player.worldPosition().y;
			var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			var angle = Math.atan2(deltaY,deltaX);

			this.texture(ige.client.textures.laserBeamTexture)
				.rotate().z(angle - player.rotate().z() - Math.radians(270))
				//.newTween()
				.height(distance)
		}

		IgeEntity.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
