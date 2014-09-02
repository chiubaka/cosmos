var LaserBeamRenderableComponent = PixiRenderableComponent.extend({
	classId: 'LaserBeamRenderableComponent',
	componentId: 'renderable',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	update: function() {
		PixiRenderableComponent.prototype.update.call(this);

		if (!this._entity._targetX || !this._entity._targetY || !this._entity._source) {
			return;
		}

		var sourceCoordinates = this._entity._source.worldCoordinates();
		var targetCoordinates = new IgePoint2d(this._entity._targetX, this._entity._targetY);

		if (!sourceCoordinates || !targetCoordinates) {
			return;
		}

		var delta = targetCoordinates.minusPoint(sourceCoordinates);
		var distance = MathUtils.magnitude(delta);
		var angle = Math.atan2(delta.y, delta.x);

		this._displayObject.height = distance * 2;
		this._displayObject.blendMode = PIXI.blendModes.ADD;
		this._displayObject.rotation = angle - this._entity._source.gridData.grid.
			renderable._displayObject.rotation + Math.radians(90);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = LaserBeamRenderableComponent; }
