/**
 * Subclass of the {@link Block} class. The Element class is handles breaking down into random
 * resources for players to collect.
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
		if (!data) {
			this.log("Element#init: No data passed to constructor.", "error");
		}

		if (!data.resource) {
			this.log("Element#init: No resource data passed to constructor.", "error");
		}

		this.resource(data.resource);

		if (!data.purity) {
			this.log("Element#init: No purity data passed to constructor.", "error");
		}

		this.purity(data.purity);

		data = this.dataFromConfig(data, this.resource());
		data.health.max = Math.ceil(data.health.max * Element.HEALTH_MODIFIERS[this.purity()]);

		this.initTextureValues();
		Block.prototype.init.call(this, data);
	},

	childGridHeight: function() {
		// Height and width are the same for now.
		return this.childGridWidth();
	},

	childGridWidth: function() {
		var gridWidth = this.gridData.width;
		if (gridWidth % 2 === 0) {
			return gridWidth / 2;
		}
		else if (gridWidth % 3 === 0) {
			return gridWidth / 3;
		}

		this.log("Element#childGridWidth: Current gridWidth is not divisible by 2 or 3. Is this" +
			" a 1x1 element?", "warning");
	},

	displayName: function() {
		var displayName = cosmos.blocks.instances[this.resource()].displayName();

		if (this.purity() === Element.PURITIES.PURE) {
			displayName = "Pure " + displayName;
		}
		else if (this.purity() === Element.PURITIES.IMPURE) {
			displayName = "Impure " + displayName;
		}
		else {
			displayName = "Very Impure " + displayName;
		}

		return displayName;
	},

	initTextureValues: function() {
		this.backgroundColor = Elements[this.resource()].backgroundColor;
		this.backgroundAlpha = Elements[this.resource()].backgroundAlpha || 1;
		this.borderColor = Elements[this.resource()].borderColor;
		this.borderAlpha = Elements[this.resource()].borderAlpha || 1;
		this.textureBackground = Elements[this.resource()].textureBackground;
		this.textureOutline = Elements[this.resource()].textureOutline;
	},



	_numChildren: function() {
		var gridWidth = this.gridData.width;
		if (gridWidth % 2 === 0) {
			return 4;
		}
		else if (gridWidth % 3 === 0) {
			return 9;
		}

		this.log("Element#_numChildren: Current gridWidth is not divisible by 2 or 3. Is this" +
			" a 1x1 element?", "warning");
	},

	onDeath: function() {
		var grid = this.gridData.grid;
		var loc = this.gridData.loc;
		var gridWidth = this.gridData.width;
		var gridHeight = this.gridData.height;

		grid.remove(new IgePoint2d(loc.x, loc.y));

		ige.network.send('blockAction', {
			blockGridId: grid.id(),
			action: 'remove',
			col: loc.x,
			row: loc.y
		});

		// If this is a 1x1 element, we call
		if (gridWidth === 1 && gridHeight === 1) {
			// TODO: Create the resource that matches this Element and drop it.
			//Block.prototype.onDeath.call(this);
			return;
		}
		else {
			var numChildren = this._numChildren();
			var childGridWidth = this.childGridWidth();
			var childGridHeight = this.childGridHeight();

			for (var x = 0; x < gridWidth / childGridWidth; x++) {
				for (var y = 0; y < gridHeight / childGridHeight; y++) {
					var child = Element.randomChild(this);
					grid.put(
						child,
						new IgePoint2d(loc.x + childGridWidth * x,
							loc.y + childGridHeight * y),
						true
					);

					ige.network.send('blockAction', {
						blockGridId: grid.id(),
						action: 'put',
						block: child.toJSON()
					});
				}
			}
		}
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
		json.purity = this.purity();

		return json;
	}
});

Element.randomChild = function(parentElement) {
	var resource;
	var purity;
	var gridWidth = parentElement.childGridWidth();
	var gridHeight = parentElement.childGridHeight();

	//First let's figure out if the child is going to have the same resource as the parent
	var probabilityOfBeingTheSameElement;
	if (parentElement.purity() === Element.PURITIES.PURE) {
		probabilityOfBeingTheSameElement = 1;
	} else if (parentElement.purity() === Element.PURITIES.IMPURE) {
		probabilityOfBeingTheSameElement = .80;
	} else if (parentElement.purity() === Element.PURITIES.VERY_IMPURE) {
		probabilityOfBeingTheSameElement = .60;
	}

	if (Math.random() < probabilityOfBeingTheSameElement) {
		// We know that the child element is going to have the same resource as the parent
		resource = parentElement.resource();
		// We now need to figure out what the purity of the child is going to be.
		purity = MathUtils.chooseRandomlyFromArray(
			Element.PURITY_RELATIONSHIPS_FOR_SAME_ELEMENT[parentElement.purity()]
		);
	} else {
		// We know that the child element is going to have a different resource as the parent
		var rarityLevel;
		var randomFloat = Math.random();
		if (randomFloat < Element.RARITIES_PROBABILITY[Element.RARITIES.COMMON]) {
			rarityLevel = Element.RARITIES.COMMON;
		} else if (randomFloat < Element.RARITIES_PROBABILITY[Element.RARITIES.COMMON]
			+ Element.RARITIES_PROBABILITY[Element.RARITIES.UNCOMMON])
		{
			rarityLevel = Element.RARITIES.UNCOMMON;
		} else if (randomFloat < Element.RARITIES_PROBABILITY[Element.RARITIES.COMMON]
			+ Element.RARITIES_PROBABILITY[Element.RARITIES.UNCOMMON]
			+ Element.RARITIES_PROBABILITY[Element.RARITIES.RARE])
		{
			rarityLevel = Element.RARITIES.RARE;
		} else {
			rarityLevel = Element.RARITIES.VERY_RARE;
		}

		var possibleImpurities = Element.RESOURCE_IMPURITIES[parentElement.resource()]
			|| Element.RESOURCE_IMPURITIES['default'];

		resource = possibleImpurities[rarityLevel];

		// We also need to figure out what the purity of the child is going to be.
		purity = MathUtils.chooseRandomlyFromArray(
			Element.PURITY_RELATIONSHIPS_FOR_DIFFERENT_ELEMENT[parentElement.purity()]
		);
	}

	return new Element({
		resource: resource,
		purity: purity,
		gridWidth: gridWidth,
		gridHeight: gridHeight
	});
};

// Enum for element rarities
Element.RARITIES = {
	COMMON: 1,
	UNCOMMON: 2,
	RARE: 3,
	VERY_RARE: 4
};

// Enum for element purities
Element.PURITIES = {
	PURE: 1, // Pure means 91-100% pure
	IMPURE: 2, // Impure means 71-90% pure
	VERY_IMPURE: 3 // Very impure means 51-70% pure
};

Element.RARITIES_PROBABILITY = {};
Element.RARITIES_PROBABILITY[Element.RARITIES.COMMON] = .6;
Element.RARITIES_PROBABILITY[Element.RARITIES.UNCOMMON] = .3;
Element.RARITIES_PROBABILITY[Element.RARITIES.RARE] = .08;
Element.RARITIES_PROBABILITY[Element.RARITIES.VERY_RARE] = .02;

Element.RESOURCE_IMPURITIES = {};
Element.RESOURCE_IMPURITIES['default'] = {};
Element.RESOURCE_IMPURITIES['default'][Element.RARITIES.COMMON] = 'IceBlock';
Element.RESOURCE_IMPURITIES['default'][Element.RARITIES.UNCOMMON] = 'CarbonBlock';
Element.RESOURCE_IMPURITIES['default'][Element.RARITIES.RARE] = 'GoldBlock';
Element.RESOURCE_IMPURITIES['default'][Element.RARITIES.VERY_RARE] = 'DragonBlock';

Element.RESOURCE_IMPURITIES['IronBlock'] = {};
Element.RESOURCE_IMPURITIES['IronBlock'][Element.RARITIES.COMMON] = 'IceBlock';
Element.RESOURCE_IMPURITIES['IronBlock'][Element.RARITIES.UNCOMMON] = 'CarbonBlock';
Element.RESOURCE_IMPURITIES['IronBlock'][Element.RARITIES.RARE] = 'GoldBlock';
Element.RESOURCE_IMPURITIES['IronBlock'][Element.RARITIES.VERY_RARE] = 'DragonBlock';

Element.RESOURCE_IMPURITIES['CarbonBlock'] = {};
Element.RESOURCE_IMPURITIES['CarbonBlock'][Element.RARITIES.COMMON] = 'IceBlock';
Element.RESOURCE_IMPURITIES['CarbonBlock'][Element.RARITIES.UNCOMMON] = 'CarbonBlock';
Element.RESOURCE_IMPURITIES['CarbonBlock'][Element.RARITIES.RARE] = 'GoldBlock';
Element.RESOURCE_IMPURITIES['CarbonBlock'][Element.RARITIES.VERY_RARE] = 'MythrilBlock';

// PURITY_RELATIONSHIPS tells you what each purity can turn into
Element.PURITY_RELATIONSHIPS_FOR_SAME_ELEMENT = {};
Element.PURITY_RELATIONSHIPS_FOR_SAME_ELEMENT[Element.PURITIES.PURE] =
	[Element.PURITIES.PURE, Element.PURITIES.PURE, Element.PURITIES.IMPURE];

Element.PURITY_RELATIONSHIPS_FOR_SAME_ELEMENT[Element.PURITIES.IMPURE] =
	[
		Element.PURITIES.PURE,
		Element.PURITIES.IMPURE,
		Element.PURITIES.IMPURE,
		Element.PURITIES.VERY_IMPURE
	];

Element.PURITY_RELATIONSHIPS_FOR_SAME_ELEMENT[Element.PURITIES.VERY_IMPURE] =
	[Element.PURITIES.IMPURE, Element.PURITIES.VERY_IMPURE, Element.PURITIES.VERY_IMPURE];

Element.PURITY_RELATIONSHIPS_FOR_DIFFERENT_ELEMENT = {};
Element.PURITY_RELATIONSHIPS_FOR_DIFFERENT_ELEMENT[Element.PURITIES.PURE] = [];
Element.PURITY_RELATIONSHIPS_FOR_DIFFERENT_ELEMENT[Element.PURITIES.IMPURE] =
	[Element.PURITIES.IMPURE, Element.PURITIES.VERY_IMPURE];
Element.PURITY_RELATIONSHIPS_FOR_DIFFERENT_ELEMENT[Element.PURITIES.VERY_IMPURE] =
	[Element.PURITIES.VERY_IMPURE];

Element.HEALTH_MODIFIERS = {};
Element.HEALTH_MODIFIERS[Element.PURITIES.PURE] = 1;
Element.HEALTH_MODIFIERS[Element.PURITIES.IMPURE] = .8;
Element.HEALTH_MODIFIERS[Element.PURITIES.VERY_IMPURE] = .6;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Element;
}
