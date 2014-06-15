/**
 * Draws the texture for a {@link Drop}.
 * @namespace {DropTexture}
 */
var image = {
	/**
	 * Draws the texture for a {@link Drop}. Traces an outline around the {@link Block} and creates an oscillating
	 * glow effect using a white shadow blur.
	 * @param ctx {Object} The rendering context.
	 * @param entity {Object} The entity that we are drawing.
	 * @memberof DropTexture
	 */
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		if (entity.decrementingShadowBlur) {
			entity.shadowBlur -= entity.shadowBlurStep;
		}
		else {
			entity.shadowBlur += entity.shadowBlurStep;
		}

		if (entity.shadowBlur >= entity.maxShadowBlur) {
			entity.decrementingShadowBlur = true;
		}
		else if (entity.shadowBlur <= entity.minShadowBlur) {
			entity.decrementingShadowBlur = false;
		}

		ctx.shadowBlur = entity.shadowBlur;
		ctx.shadowColor = entity.shadowColor;

		// Draw block outline
		ctx.fillStyle = entity.textureBackground;
		ctx.beginPath();
		ctx.moveTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.fill();
	}
};
