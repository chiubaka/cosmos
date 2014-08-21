/**
 * Subclass of the {@link Block} class. The Element class is an abstract super class for {@link Block}s that serve as
 * raw resources that players will craft into {@link Part}s.
 * Elements are found (1) on asteroids and (2) floating around in space.
 * @class
 * @typedef {Element}
 * @namespace
 */
var Element = Block.extend({
	classId: 'Element',

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
		data = this.dataFromConfig(data);
		Block.prototype.init.call(this, data);
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
	}
});

/**
 * Instantiates an element block of a specified size from a type. Will return undefined if asked
 * to instantiate a block that is not an element.
 * @param type {String} The classId string of the element to create.
 * @param dimensions {Object} An object with two properties: {gridWidth: {number}, gridHeight:
 * {number}}.
 * Specifies how many rows and columns this block takes up in the grid.
 * @returns {undefined}
 */
Element.fromType = function(type, dimensions) {
	if (cosmos.blocks.constructors[type] === undefined) {
		return undefined;
	}
	if (!Element.checkType(type)) {
		console.warn("Element#fromType: attempted to instantiated a non-element block type.");
		return undefined;
	}

	dimensions = dimensions || {gridWidth: 1, gridHeight: 1};

	return new cosmos.blocks.constructors[type](dimensions);
};

Element.checkType = function(type) {
	return cosmos.blocks.instances[type] instanceof Element;
};

Element.PURITIES = {
	PURE: 1, // Pure means 91-100% pure
	IMPURE: 2, // Impure means 71-90% pure
	VERY_IMPURE: 3 // Very impure means 51-70% pure
};

Element.HEALTH_MODIFIERS = {
	PURE: 1,
	IMPURE: .8, // We have some notion that impurities weaken an element
	VERY_IMPURE: .6
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Element; }
