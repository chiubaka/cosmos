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
		// Load Tooltipster tooltip library
		$.getScript(CraftingUIComponent.TOOLTIPSTER_ROOT + 'jquery.tooltipster.min.js', function() {
			// Load Tooltipster CSS
			$('<link/>', {
				 rel: 'stylesheet',
				 type: 'text/css',
				 href: CraftingUIComponent.TOOLTIPSTER_ROOT + 'css/tooltipster.css'
			}).appendTo('head');
			$('<link/>', {
				 rel: 'stylesheet',
				 type: 'text/css',
				 href: CraftingUIComponent.TOOLTIPSTER_ROOT +
					 'css/themes/tooltipster-cosmos.css'
			}).appendTo('head');


			ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
		});
	},

	// Refresh crafting UI in response to cargo changes.
	// TODO: Cache blocks and tooltips. Only redraw things that are necessary.
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

		// Add an onclick function
		container.attr('recipe', recipeName);
		container.unbind('click');
		container.click(function() {
			console.log('Carfting UI clicked: ' + container.attr('recipe'));
			ige.craftingSystem.craftClient(recipeName);
		});

		// Generate tooltip content
		var tooltipContent = $(this.fillTooltip(recipeName));

		// If tooltip exists, update content
		if(container.hasClass('tooltipstered')) {
			container.tooltipster('content', tooltipContent);
		}
		else {
		// If tooltip doesn't exist, create new tooltip
			container.tooltipster({
				content: tooltipContent,
				delay: 0,
				position: 'bottom-left',
				theme: 'tooltipster-cosmos'
			});
		}

		// Draw the block
		this.drawBlockInContainer(container, type);
	},

	fillTooltip: function(recipeName) {
		// TODO: Use templating engine to generate tooltip content
		var recipe = Recipies[recipeName];
		var content = '<span>';

		// Output recipe title
		content += recipeName + '<br><br>';

		// Output reactants
		content += 'Reactants required: <br>';
		for (reactant in recipe.reactants) {
			if (recipe.reactants.hasOwnProperty(reactant)) {
				content += reactant + ': ';
				content += recipe.reactants[reactant] + '<br>';
			}
		}
		content += '</span>';
		return content;
	}

});

CraftingUIComponent.UI_ROOT = '/components/crafting/';
CraftingUIComponent.TOOLTIPSTER_ROOT = '/vendor/tooltipster/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingUIComponent;
}
