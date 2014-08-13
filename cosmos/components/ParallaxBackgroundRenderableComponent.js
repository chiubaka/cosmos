var ParallaxBackgroundRenderableComponent = PixiRenderableComponent.extend({
	classId: 'ParallaxBackgroundRenderableComponent',
	componentId: 'renderable',

	init: function(entity, data) {
		PixiRenderableComponent.prototype.init.call(this, entity, data);
		this._parallaxLag = 1;
	},

	/**
	 * Getter/setter for the parallaxLag property.
	 * @param val {number} Optional parameter. If set, this is the new
	 * parallaxLag
	 * @returns {*} parallaxLag value if no parameter is passed or this object if a
	 * parameter is passed to make setter chaining convenient.
	 * @memberof ParallaxBackground
	 * @instance
	 */
	parallaxLag: function(val) {
		if (val !== undefined) {
			this._parallaxLag = val;
			return this._entity;
		}
		return this._parallaxLag;
	},

	update: function() {
		var camera = ige._currentCamera;

		this._displayObject.position.x = this._entity.translate().x() + (camera._translate.x / this._parallaxLag - this._entity.width() / 2);
		this._displayObject.position.y = this._entity.translate().y() + (camera._translate.y / this._parallaxLag - this._entity.height() / 2);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ParallaxBackgroundRenderableComponent; }
