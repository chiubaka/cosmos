var ParticleRenderableComponent = PixiRenderableComponent.extend({
	classId: 'ParticleRenderableComponent',
	componentId: 'pixiRenderable',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	update: function() {
		PixiRenderableComponent.prototype.update.call(this);

		this._displayObject.position.x -= this._entity.width() / 2;
		this._displayObject.position.y -= this._entity.height() / 2;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ParticleRenderableComponent; }