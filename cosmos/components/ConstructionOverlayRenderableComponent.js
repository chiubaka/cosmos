var ConstructionOverlayRenderableComponent = PixiRenderableComponent.extend({
	classId: 'ConstructionOverlayRenderableComponent',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
	},

	renderConstructionLocations: function() {
		// Clear all children
		for (var i = 0; i < this._displayObject.children.length; i++) {
			this._displayObject.removeChildAt(0);
		}

		var constructionLocations = this._entity._constructionLocations;

		//console.log(constructionLocations);
		console.log("Width: " + this._entity.width());
		console.log("Height: " + this._entity.height());

		for (var x = 0; x < constructionLocations.length; x++) {
			for (var y = 0; y < constructionLocations[0].length; y++) {
				if (constructionLocations[x][y] > 0) {
					for (var blockX = 0; blockX < this._entity._blockWidth; blockX++) {
						for (var blockY = 0; blockY < this._entity._blockHeight; blockY++) {
							var sprite = PIXI.Sprite.fromFrame("construction_zone");

							sprite.width = Block.WIDTH;
							sprite.height = Block.HEIGHT;
							//sprite.anchor.set(0.5);

							// TODO: Position the sprite based on location in the Grid.
							sprite.position.x = Block.WIDTH * (x + blockX) - this._entity.width() / 2;
							sprite.position.y = Block.HEIGHT * (y + blockY) - this._entity.height() / 2;

							this._displayObject.addChild(sprite);
						}
					}
				}
			}
		}
	}
});