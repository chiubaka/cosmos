
var image = {
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		// Width of the outline
		ctx.lineWidth = entity.textureOutlineWidth || 4;

		// Draw block background
		ctx.fillStyle = entity.textureBackground || "rgb(217, 217, 217)";
		ctx.beginPath();
		ctx.moveTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.fill();

		// Draw block outline
		ctx.strokeStyle = entity.textureOutline || 'rgb(201, 201, 201)';
		ctx.beginPath();
		ctx.moveTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.stroke();

		// Draw block health
		if (entity._displayHealth) {
			// The current width of the health bar computed based on the percentage of health remaining
			var healthBarWidth = (entity.width() - 2 * Block.prototype.HEALTH_BAR_MARGIN)
				* (entity._hp / entity.MAX_HP);

			// The x-coordinate to start drawing the health bar based on the margin constant from the Block class
 			var healthBarStartX = -entity._bounds2d.x2 + Block.prototype.HEALTH_BAR_MARGIN;

			// Fill color is red
			ctx.fillStyle = "rgb(255, 0, 0)";
			ctx.beginPath();
			ctx.moveTo(healthBarStartX, entity._bounds2d.y2 - Block.prototype.HEALTH_BAR_MARGIN
				- Block.prototype.HEALTH_BAR_HEIGHT);
			ctx.lineTo(healthBarStartX, entity._bounds2d.y2 - Block.prototype.HEALTH_BAR_MARGIN);
			ctx.lineTo(healthBarStartX + healthBarWidth, entity._bounds2d.y2 - Block.prototype.HEALTH_BAR_MARGIN);
			ctx.lineTo(healthBarStartX + healthBarWidth, entity._bounds2d.y2 - Block.prototype.HEALTH_BAR_MARGIN
				- Block.prototype.HEALTH_BAR_HEIGHT);
			ctx.lineTo(healthBarStartX, entity._bounds2d.y2 - Block.prototype.HEALTH_BAR_MARGIN
				- Block.prototype.HEALTH_BAR_HEIGHT);
			ctx.fill();
		}

		// Draw block icon
		if (entity.textureSvg)
		{
			if (!entity.textureImage) {
				// Convert the SVG XML into a data URI
				var imageSrc = 'data:image/svg+xml;base64,' + btoa(entity.textureSvg);

				var image = new Image();
				image.src = imageSrc;
				image.onload = function() {
					// Cache the image so we don't have to keep drawing it from the SVG
					entity.textureImage = image;
					// Tell the entity it should redraw itself
					entity.cacheDirty(true);
				}
			}
			else {
				var iconScaleFactor = 0.85;
				ctx.drawImage(entity.textureImage, -entity._bounds2d.x2 * iconScaleFactor, -entity._bounds2d.y2 * iconScaleFactor, entity.width() * iconScaleFactor, entity.height() * iconScaleFactor);
			}
		}
	}
};
