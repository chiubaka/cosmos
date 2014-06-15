/**
 * asdfasdf
 * @class
 * @typedef {IgeEntity} GlowEffect
 * @namespace
 */
var GlowEffect = IgeEntity.extend({
	classId: 'GlowEffect',

	maxShadowBlur: undefined,
	minShadowBlur: undefined,
	shadowBlurStep: undefined,
	shadowBlur: undefined,
	decrementingShadowBlur: undefined,

	init: function(data) {
		IgeEntity.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.height((data && data.height) || GlowEffect.DEFAULT_HEIGHT);
			this.width((data && data.width) || GlowEffect.DEFAULT_WIDTH);
			this.maxShadowBlur = (data && data.maxShadowBlur) || GlowEffect.DEFAULT_MAX_SHADOW_BLUR;
			this.minShadowBlur = (data && data.minShadowBlur) || GlowEffect.DEFAULT_MIN_SHADOW_BLUR;
			this.shadowBlurStep = (data && data.shadowBlurStep) || GlowEffect.DEFAULT_SHADOW_BLUR_STEP;
			this.shadowBlur = (data && data.startShadowBlur) || GlowEffect.DEFAULT_START_SHADOW_BLUR;
			this.shadowColor = (data && data.shadowColor) || GlowEffect.DEFAULT_SHADOW_COLOR;
			this.decrementingShadowBlur = (data && data.decrementingShadowBlur) || true;
			this.textureBackground = (data && data.textureBackground) || GlowEffect.DEFAULT_TEXTURE_BACKGROUND;
			this.texture(ige.client.textures.glow);

			console.log(data.textureBackground);
			console.log(this.textureBackground);
		}
	}
});

GlowEffect.DEFAULT_HEIGHT = Block.HEIGHT;
GlowEffect.DEFAULT_WIDTH = Block.WIDTH;
GlowEffect.DEFAULT_MAX_SHADOW_BLUR = 75;
GlowEffect.DEFAULT_MIN_SHADOW_BLUR = 25;
GlowEffect.DEFAULT_SHADOW_BLUR_STEP = 2;
GlowEffect.DEFAULT_SHADOW_COLOR = 'white';
GlowEffect.DEFAULT_START_SHADOW_BLUR = GlowEffect.DEFAULT_MAX_SHADOW_BLUR;
GlowEffect.DEFAULT_TEXTURE_BACKGROUND = 'rgb(255, 255, 255)';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GlowEffect; }
