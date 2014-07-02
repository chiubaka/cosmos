var WindowsComponent = IgeEventingClass.extend({
	classId: 'WindowsComponent',
	componentId: 'windows',

	init: function() {
		var self = this;
		var leftToolbar = $('#left-toolbar');
		if (leftToolbar.length === 0) {
			this.log('Left toolbar has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(WindowsComponent.UI_ROOT + 'windows.html', function(html) {
			leftToolbar.append(html);
			self.windows = $('#windows');
			ige.emit('cosmos:hud.leftToolbar.subcomponent.loaded', self);
		});

		this.numComponentsToLoad = 2;

		ige.on('cosmos:hud.leftToolbar.subcomponent.loaded', function(component) {
			self.numComponentsToLoad--;
			if (self.numComponentsToLoad === 0) {
				ige.emit('cosmos:hud.subcomponent.loaded', self);
			}
		});

		this.addComponent(CargoComponent);
		this.addComponent(CraftingComponent);
	},

});

WindowsComponent.UI_ROOT = '/components/windows/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = WindowsComponent;
}
