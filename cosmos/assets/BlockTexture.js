
var image = {
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		// Draw block background
		if (entity.textureBackground !== undefined) {
			ctx.fillStyle = entity.textureBackground;
			ctx.fillRect(-entity._bounds2d.x2, -entity._bounds2d.y2, entity.width(), entity.height());
		}

		// Width of the outline
		ctx.lineWidth = Block.WIDTH / 15;

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
			// In the future, modify the SVG's XML data here
			//var svgXML = entity.texture.svgXML;
			var image = entity.textureSvg.image;
			var iconScaleFactor = entity.iconScaleFactor || 0.85;
			ctx.drawImage(image, -entity._bounds2d.x2 * iconScaleFactor, -entity._bounds2d.y2 * iconScaleFactor, entity.width() * iconScaleFactor, entity.height() * iconScaleFactor);
		}
	}
};
