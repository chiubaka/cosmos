var image = {
	render: function(ctx, entity) {
		ctx.globalCompositeOperation = "source-over";

		// Draw block background
		ctx.fillStyle = "(0, 0, 0)";
		//ctx.opacity = 0.5;
		ctx.beginPath();
		ctx.moveTo(-entity._geometry.x2, -entity._geometry.y2);
		ctx.lineTo(entity._geometry.x2, -entity._geometry.y2);
		ctx.lineTo(entity._geometry.x2, entity._geometry.y2);
		ctx.lineTo(-entity._geometry.x2, entity._geometry.y2);
		ctx.lineTo(-entity._geometry.x2, -entity._geometry.y2);
		ctx.fill();
	}
};
