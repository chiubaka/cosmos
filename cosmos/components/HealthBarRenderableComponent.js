var HealthBarRenderableComponent = PixiRenderableComponent.extend({
	classId: 'HealthBarRenderableComponent',
	componentId: 'renderable',

	lastHp: undefined,

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	update: function() {
		PixiRenderableComponent.prototype.update.call(this);

		// Cache the last HP value and only do anything if the HP has changed.
		if (this.lastHp !== this._entity._block.health.value) {

			// If lastHp is undefined, we've never drawn before, so no need to clear.
			if (this.lastHp !== undefined) {
				this._displayObject.clear();
			}

			this.lastHp = this._entity._block.health.value;

			this._displayObject.beginFill(0xFF0000, 0.4);
			this._displayObject.drawRect(0, 0,
					this._entity._block.width()
					* (1 - this._entity._block.health.value / this._entity._block.health.max),
				this._entity._block.height()
			);
			this._displayObject.endFill();
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HealthBarRenderableComponent;
}
