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

		/*self.craftingBlocks = {};

		HUDComponent.loadHtml(CraftingUIComponent.UI_ROOT + 'crafting.html', function(html) {
			leftToolbar.append(html);
			self.element = $('#crafting');
			self.button = self.element.find('.button').first();
			self.containers = self.element.find('#crafting-containers');
			self.emptyLabel = self.element.find('#crafting-empty-label');

			// Create crafting window
			HUDComponent.loadHtml(CraftingUIComponent.UI_ROOT + 'crafting-window.html', function(html) {
				windows.append(html);
				self.craftingWindow = $('#crafting-window');

				self.button.click(function() {
					if (self.button.hasClass('active')) {
						self.close();
					}
					else {
						self.open();
					}
				});

				ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', self);
			});
		});*/
	},

	_onWindowLoaded: function() {
		ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
	},

	// Refresh crafting UI in response to cargo changes.
	refresh: function() {
		// TODO: Actaully refresh the crafting UI
		// ige.client.player.crafting.craftableRecipies();
		console.log('Refresh crafting UI');
	}
});

CraftingUIComponent.UI_ROOT = '/components/crafting/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingUIComponent;
}
