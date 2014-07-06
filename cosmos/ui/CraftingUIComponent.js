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

	populate: function(recipies, craftableBlocks) {
		var containers = this.table.find('td');
		containers.removeClass('active');

		var canvases = this.table.find('canvas')
		if (canvases.length > 0) {
			canvases.remove();
		}

		// TODO: Grey out recipies that are known but not craftable
		for (var i = 0; i < craftableBlocks.length; i++) {
			var blockType = craftableBlocks[i];
			var block = cosmos.blocks.craftable.instances[blockType];
			this.fillContainer(i, block);
		}
		/*for (var recipeName in craftableRecipies) {
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
		}*/
	},

	fillContainer: function(index, block) {
		var container = this.table.find('td').eq(index);

		// Add an onclick function
		container.attr('recipe', block.recipe.name);
		container.unbind('click');
		container.click(function() {
			console.log('Crafting UI clicked: ' + container.attr('recipe'));
			ige.craftingSystem.craftClient(recipeName);
		});

		// Generate tooltip content
		var tooltipContent = $(this.fillTooltip(block.recipe));

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
		this.drawBlockInContainer(container, block.classId());
	},

	fillTooltip: function(recipe) {
		// TODO: Use templating engine to generate tooltip content
		var content = '<span>';

		dust.render('crafting/tooltip', {recipeName: {test: function() { return recipeName }}}, function(err, out) {
			console.log(out);
		});

		// Output recipe title
		var humanReadableRecipeName = recipe.name;
		content += humanReadableRecipeName + '<br><br>';


		// Output reactants
		content += 'Reactants required: <br>';
		for (var i = 0; i < recipe.reactants.length; i++) {
			var reactant = recipe.reactants[i];
			content += Block.displayNameFromClassId(reactant.blockType) + ': ';
			content += reactant.quantity + '<br>';
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
