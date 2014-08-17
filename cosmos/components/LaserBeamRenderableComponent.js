var LaserBeamRenderableComponent = PixiRenderableComponent.extend({
	classId: 'LaserBeamRenderableComponent',
	componentId: 'renderable',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	update: function() {
		PixiRenderableComponent.prototype.update.call(this);

		if (!this._entity._target || !this._entity._source) {
			return;
		}

		var sourceCoordinates = this._entity._source.worldCoordinates();
		var targetCoordinates = this._entity._target.worldCoordinates();

		if (!sourceCoordinates || !targetCoordinates) {
			return;
		}

		var delta = targetCoordinates.minusPoint(sourceCoordinates);
		var distance = MathUtils.magnitude(delta);
		var angle = Math.atan2(delta.y, delta.x);

		this._displayObject.height = distance * 2;

		this._displayObject.rotation = angle - this._entity._source.gridData.grid.rotate().z() + Math.radians(90);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = LaserBeamRenderableComponent; }
