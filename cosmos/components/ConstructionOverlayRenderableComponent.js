var ConstructionOverlayRenderableComponent = PixiRenderableComponent.extend({
	classId: 'ConstructionOverlayRenderableComponent',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	renderConstructionLocations: function() {
		// TODO: Clearing the children could probably be optimized to not create and destroy so
		// so many things so often.
		// Clear all children
		while (this._displayObject.children.length > 0) {
			this._displayObject.removeChildAt(0);
		}

		var constructionLocations = this._entity._constructionLocations; // TODO This should be this._entity.constructionLocations()

		for (var x = 0; x < constructionLocations.length; x++) {
			for (var y = 0; y < constructionLocations[0].length; y++) {
				if (constructionLocations[x][y] > 0) {
					var sprite = PIXI.Sprite.fromFrame("ConstructionZone.png");

					sprite.width = Block.WIDTH;
					sprite.height = Block.HEIGHT;

					sprite.position.x = Block.WIDTH * x - this._entity.width() / 2;
					sprite.position.y = Block.HEIGHT * y - this._entity.height() / 2;

					this._displayObject.addChild(sprite);
				}
			}
		}
	}
});
