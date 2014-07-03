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

		self.windows = $('<div></div>').attr('id', 'windows');
		leftToolbar.append(self.windows);

		ige.on('cosmos:hud.leftToolbar.windows.subcomponent.loaded', function(component) {
			self.numComponentsToLoad--;
			if (self.numComponentsToLoad === 0) {
				ige.emit('cosmos:hud.leftToolbar.subcomponent.loaded', self);
			}
		});

		this.numComponentsToLoad = 2;

		this.addComponent(CargoComponent);
		this.addComponent(CraftingUIComponent);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = WindowsComponent;
}
