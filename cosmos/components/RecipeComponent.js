var RecipeComponent = IgeClass.extend({
	classId: 'RecipeComponent',
	componentId: 'recipe',

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

		this.name = data.name || Block.displayNameFromClassId(entity.classId());
		this.craftable = data.craftable || true;
		this.reactants = data.reactants;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = RecipeComponent; }