/**
 * Subclass of the {@link IgeEntity} class. Defines the entity for the laser beam that is displayed when a
 * {@link Player} mines a {@link Block}.
 * @class
 * @typedef {LaserBeam}
 * @namespace
 */
var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	init: function (createData) {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.texture(ige.client.textures.laserBeamTexture)
				.width(10)

			// Fade in the laser beam
			this.opacity(0);
			this._fadeInTween();

			this.addComponent(LaserBeamRenderableComponent, {createDisplayObject: function () {
				var sprite = PIXI.Sprite.fromFrame('laserbeam');
				sprite.width = 10;
				return sprite;
			}});
		}
	},

	/**
	 * Sets the tween on this entity so that it appears to fade in.
	 * Note: Old sweeping laser tween is in commit c4192b5d5a7ee840a688744c8e6ad92fb2a97e51
	 * @returns {LaserBeam} Returns this object to make setter call chaining convenient.
	 * @memberof LaserBeam
	 * @private
	 */
	_fadeInTween: function () {
		this.tween()
			.targetObj(this.renderable)
			.stepTo({_opacity: 1}, 1000, 'inOutCubic')
			.start();

		return this;
	},

	/**
	 * Sets the location of the targeted block.
	 * @param blockGridId {string} The IGE ID of the {@link BlockGrid} we are targeting
	 * @param row {number} The row of the {@link Block} we are targeting in its {@link BlockGrid}.
	 * @param col {number} The col of the {@link Block} we are targeting in its {@link BlockGrid}.
	 * @memberof LaserBeam
	 * @instance
 	 */
	setTarget: function(blockGridId, row, col) {
		this._targetId = blockGridId;
		this._targetRow = row;
		this._targetCol = col;
		return this;
	},

	/**
	 * Override the {@link IgeEntity#update} function to move the laser beam appropriately when either the target block
	 * or the source block is moved.
	 * @param ctx {Object} The rendering context.
	 * @memberof LaserBeam
	 * @instance
	 */
	update: function(ctx) {
		if (!ige.isServer) {
			var laserMount = this.parent();
			var blockGrid = ige.$(this._targetId);
			var block = undefined;
			if (blockGrid !== undefined) {
				block = blockGrid.get(this._targetRow, this._targetCol);
			}

			// Check if the block is undefined. This happens in the update() ticks
			// where the block has been broken off the BlockGrid, but the laser
			// hasn't been destroyed yet.
			if(block === undefined) {
				IgeEntity.prototype.update.call(this, ctx);
				return;
			}

			// We need the current world matrix of the block for correct
			// worldPosition. Since the renderContainer's children do not
			// get automatically updated, we have to manually update the
			// block's tranform.
			block.updateTransform();
			// Calculate length and angle of laser
			var deltaX = block.worldPosition().x - laserMount.worldPosition().x;
			var deltaY = block.worldPosition().y - laserMount.worldPosition().y;
			var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			var angle = Math.atan2(deltaY,deltaX);

			this.rotate().z(angle - laserMount.parent().rotate().z() - Math.radians(270));
			// Distance * 2 because image is half blank
			this.height(distance * 2);
		}
		IgeEntity.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
