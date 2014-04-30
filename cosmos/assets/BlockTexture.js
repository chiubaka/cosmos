
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
		ctx.strokeStyle = entity.textureOutline || 'rgba(201, 201, 201, 1)';
		ctx.beginPath();
		ctx.moveTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.stroke();

		// Draw block health
		if (entity._displayHealth) {
			var healthBarXOffset = 3;
			var healthBarYOffset = 3;
			var healthBarHeight = 4;
			var healthBarWidth = (entity.width() - 2 * healthBarXOffset) * (entity.hp / 10);
			var healthBarStartX = -entity._bounds2d.x2 + healthBarXOffset;
			ctx.fillStyle = "rgb(255, 0, 0)";
			ctx.beginPath();
			ctx.moveTo(healthBarStartX, entity._bounds2d.y2 - healthBarYOffset - healthBarHeight);
			ctx.lineTo(healthBarStartX, entity._bounds2d.y2 - healthBarYOffset);
			ctx.lineTo(healthBarStartX + healthBarWidth, entity._bounds2d.y2 - healthBarYOffset);
			ctx.lineTo(healthBarStartX + healthBarWidth, entity._bounds2d.y2 - healthBarYOffset - healthBarHeight);
			ctx.lineTo(healthBarStartX, entity._bounds2d.y2 - healthBarYOffset - healthBarHeight);
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
				var iconScaleFactor = 0.8;
				ctx.drawImage(entity.textureImage, -entity._bounds2d.x2 * iconScaleFactor, -entity._bounds2d.y2 * iconScaleFactor, entity.width() * iconScaleFactor, entity.height() * iconScaleFactor);
			}
		}
	}
};
