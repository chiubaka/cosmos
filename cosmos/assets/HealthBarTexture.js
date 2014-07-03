/**
 * Draws the texture for a {@link HealthBar}.
 * @namespace {HealthBarTexture}
 */
var image = {
	/**
	 * Draws the health bar on a block 
	 * @param ctx {Object} The rendering context.
	 * @param entity {Object} The entity that we are drawing.
	 * @memberof HealthBar
	 */
	render: function(ctx, entity) {
		// The healthbar entity holds a reference to the block entity
		var block = entity._block;
		// The current width of the health bar computed based on the percentage of health remaining
		var healthBarWidth = (block.width() - 2 * Block.HEALTH_BAR_MARGIN)
			* (block._hp / block.MAX_HP);

		// The x-coordinate to start drawing the health bar based on the margin constant from the Block class
		var healthBarStartX = -block._bounds2d.x2 + Block.HEALTH_BAR_MARGIN;

		// Fill color is red
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fillRect(healthBarStartX,
			block._bounds2d.y2 - Block.HEALTH_BAR_MARGIN - Block.HEALTH_BAR_HEIGHT,
			healthBarWidth,
			Block.HEALTH_BAR_HEIGHT
		);
	}
};
