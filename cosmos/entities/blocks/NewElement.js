/**
 * Subclass of the {@link Block} class. The NewElement class is an abstract super class for {@link Block}s that serve as
 * raw resources that players will craft into {@link Part}s.
 * NewElements are found (1) on asteroids and (2) floating around in space.
 * @class
 * @typedef {NewElement}
 * @namespace
 */
var NewElement = Block.extend({
	classId: 'NewElement',

	/**
	 * The type of the resource that dominates this element. Also defines what the element looks
	 * like.
	 */
	_resource: undefined,
	/**
	 * The purity level of this element. Defines distributions and probability of drops.
	 */
	_purity: undefined,

	init: function(data) {
		if (!data) {
			this.log("NewElement#init: No data passed to constructor.", "error");
		}

		if (!data.resource) {
			this.log("NewElement#init: No resource data passed to constructor.", "error");
		}

		this.resource(data.resource);

		data = this.dataFromConfig(data, this.resource());
		this.initTextureValues();
		Block.prototype.init.call(this, data);
	},

	displayName: function() {
		return cosmos.blocks.instances[this.resource()].displayName();
	},

	initTextureValues: function() {
		this.backgroundColor = Elements[this.resource()].backgroundColor;
		this.backgroundAlpha = Elements[this.resource()].backgroundAlpha || 1;
		this.borderColor = Elements[this.resource()].borderColor;
		this.borderAlpha = Elements[this.resource()].borderAlpha || 1;
		this.textureBackground = Elements[this.resource()].textureBackground;
		this.textureOutline = Elements[this.resource()].textureOutline;
	},

	/**
	 * Getter/setter for purity value.
	 * @param newPurity
	 * @returns {*}
	 */
	purity: function(newPurity) {
		if (newPurity !== undefined) {
			this._purity = newPurity;
			return this;
		}
		return this._purity;
	},

	/**
	 * Getter/setter for resource value.
	 * @param newResource
	 * @returns {*}
	 */
	resource: function(newResource) {
		if (newResource !== undefined) {
			this._resource = newResource;
			return this;
		}
		return this._resource;
	},

	toJSON: function() {
		var json = Block.prototype.toJSON.call(this);
		json.resource = this.resource();

		return json;
	}
});

NewElement.PURITIES = {
	PURE: 1,
	IMPURE: 2,
	VERY_IMPURE: 3
};

NewElement.HEALTH_MODIFIERS = {
	PURE: 1,
	IMPURE:.8,
	VERY_IMPURE:.6
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NewElement;
}
