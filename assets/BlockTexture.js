var image = {
    render: function(ctx, entity) {
        ctx.globalCompositeOperation = "source-over";

        ctx.lineWidth = entity.textureOutlineWidth || 2;

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


    }
};