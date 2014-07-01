var LeftToolbarComponent = IgeEventingClass.extend({
	classId: 'LeftToolbarComponent',
	componentId: 'leftToolbar',

	element: undefined,
	numComponentsToLoad: undefined,

	init: function() {
		var self = this;
		var hud = $('#hud');
		if (hud.length === 0) {
			this.log('HUD has not been initialized.', 'error');
			return;
		}

		var leftToolbarDiv = document.createElement('div');
		leftToolbarDiv.id = 'left-toolbar';
		leftToolbarDiv.className = 'left-toolbar';

		hud.append(leftToolbarDiv);

		this.element = $('#left-toolbar');

		this.numComponentsToLoad = 2;

		ige.on('cosmos:hud.leftToolbar.subcomponent.loaded', function(component) {
			self.numComponentsToLoad--;
			if (self.numComponentsToLoad === 0) {
				ige.emit('cosmos:hud.subcomponent.loaded', self);
			}
		});

		this.addComponent(CargoComponent);
		this.addComponent(CraftingComponent);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LeftToolbarComponent;
}
