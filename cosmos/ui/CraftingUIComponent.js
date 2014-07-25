var CraftingUIComponent = WindowComponent.extend({
	classId: 'CraftingUIComponent',
	componentId: 'craftingUI',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	craftingBlocks: undefined,
	emptyLabel: undefined,

	selectedType: undefined,
	// A map of recipes to their respective DOM element. This is useful for
	// toggling tooltips for a particular recipe in the tutorial quest.
	recipeDOMElements: undefined,

	init: function() {
		WindowComponent.prototype.init.call(
			this,
			CraftingUIComponent.UI_ROOT + 'crafting-window.html',
			'crafting-window',
			$('#left-toolbar'),
			'crafting-button',
			undefined,
			'Crafting',
			'right'
		);
		recipeDOMElements = {};
	},

	_onWindowLoaded: function() {
		ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
	},

	// Refresh crafting UI in response to cargo changes.
	// TODO: Cache blocks and tooltips. Only redraw things that are necessary.
	refresh: function() {
		var recipes = ige.client.player.crafting.recipes();
		var craftableRecipes = ige.client.player.crafting.craftableRecipes();

		// Resize the crafting window, if needed
		var numTypes = Object.keys(recipes).length;
		var rowsNeeded = Math.ceil(numTypes / WindowComponent.COLS_PER_ROW);
		this.setNumRows(rowsNeeded);

		// Populate crafting window with recipes
		this.populate(recipes, craftableRecipes);
	},

	populate: function(recipes, craftableBlocks) {
		var self = this;
		var containers = this.table.find('td');
		containers.removeClass('active');

		var canvases = this.table.find('canvas');
		if (canvases.length > 0) {
			canvases.remove();
		}

		// Clear the existing recipe map
		this.recipeDOMElements = {};

		// TODO: Grey out recipes that are known but not craftable
		var i = 0;
		_.forOwn(craftableBlocks, function(canCraft, blockType) {
			var block = cosmos.blocks.instances[blockType];
			self.fillContainer(i, block);
			i++;
		});
	},

	fillContainer: function(index, block) {
		var self = this;
		var container = this.table.find('td').eq(index);
		var recipe = block.recipe;

		// Add an onclick function
		container.attr('recipe', recipe.name);
		container.unbind('click');
		container.click(function() {
			ige.craftingSystem.craftClient(block.classId());
		});

		// Add the recipe DOM element to the recipe map
		this.recipeDOMElements[block.classId()] = container;

		// Generate tooltip content
		this.fillTooltip(recipe, container, function(err, out) {
			// Draw the block
			self.drawBlockInContainer(container, block.classId());
		});

		container.mouseover(function() {
			ige.hud.inspector.inspect(block);
		});

		container.mouseout(function() {
			ige.hud.inspector.hide();
		});
	},

	fillTooltip: function(recipe, container, callback) {
		dust.render('crafting/tooltip', recipe.tooltipData(), function(err, out) {
			if (err) {
				this.log('Error rendering crafting tooltip template.');
			}

			var tooltipContent = $(out);

			// If tooltip exists, destroy it so we can set the right functionReady behavior
			if (container.hasClass('tooltipstered')) {
				container.tooltipster('destroy');
			}

			// If tooltip doesn't exist, create new tooltip
			container.tooltipster({
				content: tooltipContent,
				delay: 0,
				position: 'bottom-left',
				theme: 'tooltip crafting',
				maxWidth: '200',
				functionReady: function(origin, tooltip) {
					var canvases = $(tooltip).find('canvas.reactant');

					_.forEach(_.zip(canvases, recipe.reactants), function(pair) {
						var canvas = pair[0];
						var reactant = pair[1];

						var block = cosmos.blocks.instances[reactant.blockType];

						var scaleWidth = canvas.width / block._bounds2d.x;
						var scaleHeight = canvas.height / block._bounds2d.y;
						canvas.width = canvas.width;
						var ctx = canvas.getContext("2d");
						ctx.scale(scaleWidth, scaleHeight);
						ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
						block.texture().render(ctx, block);
					});
				}
			});

			callback(err, out);
		});
	},

	pinRecipeTooltip: function(recipeName) {
		var elem = this.recipeDOMElements[recipeName];
		elem.tooltipster('showPin');
	},

	unpinRecipeTooltip: function(recipeName) {
		var elem = this.recipeDOMElements[recipeName];
		elem.tooltipster('hideUnpin');
	}

});

CraftingUIComponent.UI_ROOT = '/components/crafting/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingUIComponent;
}
