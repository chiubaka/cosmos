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
		console.log('Refresh crafting UI');
	},

	populate: function(recipes, craftableBlocks) {
		var self = this;
		var containers = this.table.find('td');
		containers.removeClass('active');

		var canvases = this.table.find('canvas');
		if (canvases.length > 0) {
			canvases.remove();
		}

		// TODO: Grey out recipes that are known but not craftable
		var i = 0;
		_.forOwn(craftableBlocks, function(canCraft, blockType) {
			console.log('Block type: ' + blockType);
			var block = cosmos.blocks.craftable.instances[blockType];
			self.fillContainer(i, block);
			i++;
		});
	},

	fillContainer: function(index, block) {
		var self = this;
		var container = this.table.find('td').eq(index);

		// Add an onclick function
		container.attr('recipe', block.recipe.name);
		container.unbind('click');
		container.click(function() {
			console.log('Crafting UI clicked: ' + container.attr('recipe'));
			ige.craftingSystem.craftClient(block.classId());
		});

		// Generate tooltip content
		this.fillTooltip(block.recipe.tooltipData(), function(err, out) {
			if (err) {
				this.log('Error rendering crafting tooltip template.');
			}

			var tooltipContent = $(out);

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
			self.drawBlockInContainer(container, block.classId());
		});
	},

	fillTooltip: function(recipe, callback) {
		dust.render('crafting/tooltip', recipe, function(err, out) {
			callback(err, out);
		});
	}

});

CraftingUIComponent.UI_ROOT = '/components/crafting/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingUIComponent;
}
