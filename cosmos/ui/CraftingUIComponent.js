var CraftingUIComponent = WindowComponent.extend({
	classId: 'CraftingUIComponent',
	componentId: 'craftingUI',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	craftingBlocks: undefined,
	emptyLabel: undefined,

	selectedType: undefined,

	init: function() {
		WindowComponent.prototype.init.call(
			this,
			CraftingUIComponent.UI_ROOT + 'crafting-window.html',
			'crafting-window',
			$('#left-toolbar'),
			'crafting-button',
			undefined,
			'Crafting'
		);
	},

	_onWindowLoaded: function() {
		ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
	},

	// Refresh crafting UI in response to cargo changes.
	refresh: function() {
		var recipies = ige.client.player.crafting.recipies();
		var craftableRecipies = ige.client.player.crafting.craftableRecipies();

		// Resize the crafting window, if needed
		var numTypes = Object.keys(recipies).length;
		var rowsNeeded = Math.ceil(numTypes / WindowComponent.COLS_PER_ROW);
		this.setNumRows(rowsNeeded);

		// Populate crafting window with recipies
		this.populate(recipies, craftableRecipies);
		console.log('Refresh crafting UI');
	},

	populate: function(recipies, craftableRecipies) {
		var containers = this.table.find('td');
		containers.removeClass('active');

		var canvases = this.table.find('canvas')
		if (canvases.length > 0) {
			canvases.remove();
		}

		var index = 0;
		// TODO: Grey out recipies that are known but not craftable
		for (var recipeName in craftableRecipies) {
			if (!craftableRecipies.hasOwnProperty(recipeName)) {
				continue;
			}
			// Determine quantity and type of product
			// Note: This only works when there is one type of product
			var recipe = Recipies[recipeName];
			var quantity = 0;
			var type;
			for (product in recipe.products) {
				if (recipe.products.hasOwnProperty(product)) {
					quantity += recipe.products[product];
					type = product;
					break;
				}
			}

			this.fillContainer(index, type, quantity, recipeName);

			index++;
		}
	},

	fillContainer: function(index, type, quantity, recipeName) {
		var container = this.table.find('td').eq(index);
		container.attr('recipe', recipeName);
		container.unbind('click');
		container.click(function() {
			console.log('Carfting UI clicked: ' + container.attr('recipe'));
			ige.craftingSystem.craftClient(recipeName);
		});
		this.drawBlockInContainer(container, type);
	},

});

CraftingUIComponent.UI_ROOT = '/components/crafting/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingUIComponent;
}
