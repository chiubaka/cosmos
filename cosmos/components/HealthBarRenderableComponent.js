var HealthBarRenderableComponent = PixiRenderableComponent.extend({
	classId: 'HealthBarRenderableComponent',
	componentId: 'renderable',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	update: function() {
		PixiRenderableComponent.prototype.update.call(this);

		this._displayObject.clear();
		this._displayObject.beginFill(0xFF0000, 0.5);
		this._displayObject.drawRect(0, 0,
			this._entity._block.width()
				* (1 - this._entity._block.health.value / this._entity._block.health.max),
			this._entity._block.height()
		);
		this._displayObject.endFill();

		this._displayObject.x += -this._entity._block.width() / 2;
		this._displayObject.y += -this._entity._block.height() / 2;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HealthBarRenderableComponent;
}
