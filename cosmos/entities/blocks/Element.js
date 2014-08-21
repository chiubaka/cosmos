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

	init: function(data) {
		data = this.dataFromConfig(data);
		Block.prototype.init.call(this, data);
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Element;
}