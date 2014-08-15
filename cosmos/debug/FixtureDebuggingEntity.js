var FixtureDebuggingBlock = IgeEntity.extend({
	classId: 'FixtureDebuggingBlock',

	init: function(data) {
		var self = this;
		IgeEntity.prototype.init.call(this);

		if (data !== undefined) {
			this.width(data.width);
			this.height(data.height);
			this.depth(data.depth);
		}

		this.addComponent(PixiRenderableComponent, {
			createDisplayObject: function() {
				var graphic = new PIXI.Graphics();
				graphic.beginFill(0x000000, 0.5);
				graphic.lineStyle(Block.BORDER_WIDTH, 0x640000, self.borderAlpha);
				graphic.drawRect(
						Block.BORDER_WIDTH / 2,
						Block.BORDER_WIDTH / 2,
						self.width() - Block.BORDER_WIDTH,
						self.height() - Block.BORDER_WIDTH
				);
				graphic.endFill();

				return graphic;
			},
			anchor: new IgePoint2d(-Block.WIDTH / 2, -Block.HEIGHT / 2)
		});

		if (!ige.isServer) {
			this.texture(ige.client.textures.fixtureDebuggingTexture);
		}
	},

	streamCreateData: function() {
		return {
			width: this.width(),
			height: this.height(),
			depth: this.depth()
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FixtureDebuggingBlock; }
