/**
 * Subclass of the {@link IgeEntity} class. Instantiates a texture which displays as an oscillating glow effect. Can be
 * used to create a glow effect around other entities.
 * @class
 * @typedef {IgeEntity} GlowEffect
 * @namespace
 */
var GlowEffect = IgeEntity.extend({
	classId: 'GlowEffect',

	/**
	 * The maximum value of the shadow blur effect. Defines how "big" the glow gets.
	 * @type {number}
	 * @memberof GlowEffect
	 * @instance
	 */
	maxShadowBlur: undefined,
	/**
	 * The minimum value of the shadow blur effect. Defines how "small" the glow gets.
	 * @type {number}
	 * @memberof GlowEffect
	 * @instance
	 */
	minShadowBlur: undefined,
	/**
	 * The step size for the oscillation of the glow effect. Basically defines how quickly the glow oscillates.
	 * @type {number}
	 * @memberof GlowEffect
	 * @instance
	 */
	shadowBlurStep: undefined,
	/**
	 * The current shadow blur value. Updated by the GlowEffectTexture by the
	 * {@link GlowEffect#shadowBlurStep|shadowBlurStep} on each draw.
	 * @type {number}
	 * @memberof GlowEffect
	 * @instance
	 */
	shadowBlur: undefined,
	/**
	 * Whether or not the shadow blur value is increasing or decreasing. When this value is set to true, the shadow
	 * blur value is decreasing.
	 * @type {boolean}
	 * @memberof GlowEffect
	 * @instance
	 */
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
		}
	}
});

/**
 * Default height of a {@link GlowEffect} entity.
 * @constant {number}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_HEIGHT = Block.HEIGHT;
/**
 * Default width of a {@link GlowEffect} entity.
 * @constant {number}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_WIDTH = Block.WIDTH;
/**
 * Default maximum shadow blur value for a {@link GlowEffect} entity.
 * @constant {number}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_MAX_SHADOW_BLUR = 75;
/**
 * Default minimum shadow blur value for a {@link GlowEffect} entity.
 * @constant {number}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_MIN_SHADOW_BLUR = 25;
/**
 * Default step size for the shadow blur of a {@link GlowEffect} entity.
 * @constant {number}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_SHADOW_BLUR_STEP = 2;
/**
 * Default shadow color for a {@link GlowEffect} entity.
 * @constant {string}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_SHADOW_COLOR = 'white';
/**
 * Default starting value for the shadow blur of a {@link GlowEffect} entity.
 * @constant {number}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_START_SHADOW_BLUR = GlowEffect.DEFAULT_MAX_SHADOW_BLUR;
/**
 * Default fill color for the {@link GlowEffect}. Note: shadow blurs do not show unless there is a fill. They also
 * don't show if the fill color alpha is set to 0. This makes drawing the glow effect independently of a fill difficult,
 * but in most cases the fill is hidden behind the Block's texture.
 * @todo Ultimately, the right thing to do is probably use some sort of canvas clipping and offset to hide the fill but
 * still display the shadow.
 * @constant {string}
 * @default
 * @memberof GlowEffect
 */
GlowEffect.DEFAULT_TEXTURE_BACKGROUND = 'rgb(255, 255, 255)';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GlowEffect; }
