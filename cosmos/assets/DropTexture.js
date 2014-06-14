
var image = {
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		if (entity.decrementingShadowBlur) {
			entity.shadowBlur -= Drop.SHADOW_BLUR_STEP;
		}
		else {
			entity.shadowBlur += Drop.SHADOW_BLUR_STEP;
		}

		if (entity.shadowBlur >= Drop.MAX_SHADOW_BLUR) {
			entity.decrementingShadowBlur = true;
		}
		else if (entity.shadowBlur <= Drop.MIN_SHADOW_BLUR) {
			entity.decrementingShadowBlur = false;
		}

		ctx.shadowBlur = entity.shadowBlur;
		ctx.shadowColor = 'white';

		// Draw block outline
		ctx.strokeStyle = entity.textureOutline || 'rgba(255, 255, 255, 0)';
		ctx.beginPath();
		ctx.moveTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.lineTo(entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, entity._bounds2d.y2);
		ctx.lineTo(-entity._bounds2d.x2, -entity._bounds2d.y2);
		ctx.fill();
	}
};
