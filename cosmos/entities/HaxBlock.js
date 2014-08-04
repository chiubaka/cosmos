var HaxBlock = IgeEntity.extend({
	classId: 'HaxBlock',

	init: function() {
		if (ige.isClient) {
			this.backgroundTexture = PIXI.TextureCache.background_helix_nebula;
			this.backgroundWidth = 100;
			this.backgroundHeight = 100;
		}

		ParallaxBackground.prototype.init.call(this);

		if (ige.isClient) {
			this.texture(ige.client.textures.background_helix_nebula)
				.width(100)
				.height(100);
		}
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = HaxBlock; }
