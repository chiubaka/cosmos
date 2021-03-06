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
		var cells = this.table.find('td');
		cells.removeClass('active');

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
			self.fillCell(i, block);
			i++;
		});
	},

	fillCell: function(index, block) {
		var self = this;
		var cell = this.table.find('td').eq(index);
		var recipe = block.recipe;

		// Add an onclick function
		cell.attr('recipe', recipe.name);
		cell.unbind('click');
		cell.click(function() {
			ige.craftingSystem.craftClient(block.classId());
		});

		// Add the recipe DOM element to the recipe map
		this.recipeDOMElements[block.classId()] = cell;

		// Generate tooltip content
		this.fillTooltip(recipe, cell, function(err, out) {
			// Draw the block
			self.drawBlockInCell(cell, block.classId());
		});

		cell.mouseover(function() {
			ige.hud.inspector.inspect(block);
		});

		cell.mouseout(function() {
			ige.hud.inspector.hide();
		});
	},

	fillTooltip: function(recipe, cell, callback) {
		dust.render('crafting/tooltip', recipe.tooltipData(), function(err, out) {
			if (err) {
				this.log('Error rendering crafting tooltip template.');
			}

			var tooltipContent = $(out);

			// If tooltip exists, destroy it so we can set the right functionReady behavior
			if (cell.hasClass('tooltipstered')) {
				cell.tooltipster('destroy');
			}

			// If tooltip doesn't exist, create new tooltip
			cell.tooltipster({
				content: tooltipContent,
				delay: 0,
				position: 'bottom-left',
				theme: 'tooltip crafting',
				maxWidth: '200',
				functionReady: function(origin, tooltip) {
					var textureContainers = $(tooltip).find('.block-texture-container');

					_.forEach(_.zip(textureContainers, recipe.reactants), function(pair) {
						var textureContainer = pair[0];
						var reactant = pair[1];

						var block = cosmos.blocks.instances[reactant.blockType];

						if (block instanceof Part) {
							var imgs = $(textureContainer).find('img');
							var img = (imgs.length === 0) ? $('<img/>')[0] : imgs[0];
							img.src = '/assets/sprites/' + block.iconFrame;
							$(textureContainer).prepend(img);
						}
						else {
							var canvases = $(textureContainer).find('canvas');
							var canvas = (canvases.length === 0) ?
								$('<canvas></canvas>')[0] : canvases[0];
							$(textureContainer).prepend(canvas);

							var scaleWidth = canvas.width / block._bounds2d.x;
							var scaleHeight = canvas.height / block._bounds2d.y;
							canvas.width = canvas.width;
							var ctx = canvas.getContext("2d");
							ctx.scale(scaleWidth, scaleHeight);
							ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
							block.texture().render(ctx, block);
						}
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
