var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	init: function (createData) {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this._targetId = createData[0];
			this._targetRow = createData[1];
			this._targetCol = createData[2];

			this.texture(ige.client.textures.laserBeamTexture)

			// Fade in the laser beam
			this.opacity(0);
			this.newTween();
		}
	},

	newTween: function () {
		/*
		// Old tween example. This creates a sweeping laser

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
		*/

		this.tween()
			.stepTo({_opacity: 1}, 1000, 'inOutCubic')
			.start();

		return this;
	},

	// Server sets the location of the targeted block. This gets streamed
	// with our custom streamCreateData() function.
	setTarget: function(blockGridId, row, col) {
		this._targetId = blockGridId;
		this._targetRow = row;
		this._targetCol = col;
		return this;
	},


	// Send custom data to client upon creation through network stream
	streamCreateData: function () {
		return [this._targetId, this._targetRow, this._targetCol];
	},

	update: function(ctx) {
		if (!ige.isServer) {
			var laserMount = this.parent();
			var blockGrid = ige.$(this._targetId);
			var block = undefined;
			if (blockGrid !== undefined) {
				block = blockGrid.grid()[this._targetRow][this._targetCol];
			}

			// Check if the block is undefined. This happens in the update() ticks
			// where the block has been broken off the BlockGrid, but the laser
			// hasn't been destroyed yet.
			if(block === undefined) {
				IgeEntity.prototype.update.call(this, ctx);
				return;
			}

			// Calculate length and angle of laser
			var deltaX = block.worldPosition().x - laserMount.worldPosition().x;
			var deltaY = block.worldPosition().y - laserMount.worldPosition().y;
			var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			var angle = Math.atan2(deltaY,deltaX);

			this.rotate().z(angle - laserMount.parent().rotate().z() - Math.radians(270))
			// Distance * 2 because image is half blank
			this.height(distance * 2);
		}
		IgeEntity.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
