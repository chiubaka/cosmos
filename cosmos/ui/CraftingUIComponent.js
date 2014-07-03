var CraftingUIComponent = IgeEventingClass.extend({
	classId: 'CraftingUIComponent',
	componentId: 'craftingUI',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	craftingBlocks: undefined,
	emptyLabel: undefined,

	selectedType: undefined,

	init: function() {
		var self = this;
		var leftToolbar = $('#left-toolbar');
		if (leftToolbar.length === 0) {
			self.log('Left toolbar has not been initialized.', 'error');
			return;
		}
		var windows = $('#windows');
		if (windows.length === 0) {
			self.log('Windows has not been initialized.', 'error');
			return;
		}

		self.craftingBlocks = {};

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
		});
	},

	open: function() {
		this.craftingWindow.show();
		this.button.addClass('active');
	},

	close: function() {
		this.craftingWindow.hide();
		this.button.removeClass('active');
	},
});

CraftingUIComponent.UI_ROOT = '/components/crafting/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingUIComponent;
}
