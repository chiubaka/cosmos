var LaserBeamRenderableComponent = PixiRenderableComponent.extend({
	classId: 'LaserBeamRenderableComponent',
	componentId: 'pixiRenderable',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	update: function() {
		var laserMount = this._entity.parent();
		var blockGrid = ige.$(this._entity._targetId);
		var block = undefined;
		if (blockGrid !== undefined) {
			console.log('Laser beam: target block grid is defined');
			block = blockGrid.get(this._entity._targetRow, this._entity._targetCol);
		}

		if (block === undefined) {
			console.log('Laser beam: target block is undefined');
			//PixiRenderableComponent.prototype.update.call(this);
			return;
		}

		block.updateTransform();
		var deltaX = block.worldPosition().x - laserMount.worldPosition().x;
		var deltaY = block.worldPosition().y - laserMount.worldPosition().y;
		var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
		var angle = Math.atan2(deltaY, deltaX);
		this._displayObject.position.x = this._entity.translate().x();
		this._displayObject.position.y = this._entity.translate().y();
		this._displayObject.rotation = angle - laserMount.parent().rotate().z() - Math.radians(90);
		this._displayObject.height = distance * 2;
		console.log("Laser beam length: " + this._displayObject.height);

		//PixiRenderableComponent.prototype.update.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = LaserBeamRenderableComponent; }