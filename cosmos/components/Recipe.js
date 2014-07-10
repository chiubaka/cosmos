var Recipe = IgeClass.extend({
	classId: 'Recipe',
	componentId: 'recipe',

	/**
	 * The entity that this component has been added to.
	 */
	entity: undefined,
	/**
	 * The name of this recipe. Matches the block it is added to.
	 */
	name: undefined,
	/**
	 * Whether or not this recipe is craftable by players. Certain blocks may not be.
	 */
	craftable: undefined,
	/**
	 * Object containing the reactants of this recipe. This is a list of {blockType: string, quantity: number} objects.
	 */
	reactants: undefined,

	init: function(entity, data) {
		if (data === undefined || data.reactants === undefined) {
			this.log('Init parameters not provided for recipe component.', 'error');
			return;
		}

		this.entity = entity;
		this.name = data.name || Block.displayNameFromClassId(entity.classId());
		this.craftable = data.craftable || true;
		this.reactants = data.reactants;
	},

	tooltipData: function() {
		var data = {};
		data.name = this.name;
		data.description = this.entity.description.text;
		data.reactants = [];
		for (var i = 0; i < this.reactants.length; i++) {
			var reactant = this.reactants[i];
			data.reactants.push(
				{
					blockType: Block.displayNameFromClassId(reactant.blockType),
					quantity: reactant.quantity
				}
			);
		}

		return data;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Recipe; }