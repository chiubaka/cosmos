var image = {
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		// Width of the outline
		ctx.lineWidth = entity.textureOutlineWidth || 4;

		// Draw block background
		ctx.fillStyle = entity.textureBackground || "rgb(217, 217, 217)";
		ctx.beginPath();
		ctx.moveTo(-entity._geometry.x2, -entity._geometry.y2);
		ctx.lineTo(entity._geometry.x2, -entity._geometry.y2);
		ctx.lineTo(entity._geometry.x2, entity._geometry.y2);
		ctx.lineTo(-entity._geometry.x2, entity._geometry.y2);
		ctx.lineTo(-entity._geometry.x2, -entity._geometry.y2);
		ctx.fill();

		// Draw block outline
		ctx.strokeStyle = entity.textureOutline || 'rgba(201, 201, 201, 1)';
		ctx.beginPath();
		ctx.moveTo(-entity._geometry.x2, -entity._geometry.y2);
		ctx.lineTo(entity._geometry.x2, -entity._geometry.y2);
		ctx.lineTo(entity._geometry.x2, entity._geometry.y2);
		ctx.lineTo(-entity._geometry.x2, entity._geometry.y2);
		ctx.lineTo(-entity._geometry.x2, -entity._geometry.y2);
		ctx.stroke();

		if (entity.textureSvgUrl)
		{
			if (!entity.svg)
			{
				var image = new Image();
				image.src = gameRoot + entity.textureSvgUrl;

				image.onload = function() {
					image.width = entity.width();
					image.height = entity.height();
					entity.svg = image;
					console.log(entity.svg);
					entity.cacheDirty(true);
				}
			}
			else
			{
				var iconScaleFactor = 0.8;
				ctx.drawImage(entity.svg, -entity._geometry.x2 * iconScaleFactor, -entity._geometry.y2 * iconScaleFactor, entity.width() * iconScaleFactor, entity.height() * iconScaleFactor);
			}
		}
    }
};