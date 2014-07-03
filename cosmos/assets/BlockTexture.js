
var image = {
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		// Draw block background
		if (entity.textureBackground !== undefined) {
			ctx.fillStyle = entity.textureBackground;
			ctx.fillRect(-entity._bounds2d.x2, -entity._bounds2d.y2, entity.width(), entity.height());
		}

		// Width of the outline
		ctx.lineWidth = 1;

		// Draw block outline
		if (entity.textureOutline !== undefined) {
			ctx.strokeStyle = entity.textureOutline;
			ctx.strokeRect(-entity._bounds2d.x2 + ctx.lineWidth / 2,
					-entity._bounds2d.x2 + ctx.lineWidth / 2,
					entity.width() - ctx.lineWidth,
					entity.height() - ctx.lineWidth
			);
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
				var iconScaleFactor = entity.iconScaleFactor || 0.85;
				ctx.drawImage(entity.textureImage, -entity._bounds2d.x2 * iconScaleFactor, -entity._bounds2d.y2 * iconScaleFactor, entity.width() * iconScaleFactor, entity.height() * iconScaleFactor);
			}
		}
	}
};
