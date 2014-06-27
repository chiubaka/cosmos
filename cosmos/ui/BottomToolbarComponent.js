var BottomToolbarComponent = IgeEventingClass.extend({
	classId: 'BottomToolbarComponent',
	componentId: 'bottomToolbar',

	element: undefined,

	init: function() {
		var hud = $('#hud');
		if (hud.length === 0) {
			this.log('HUD has not been initialized.', 'error');
			return;
		}

		var bottomToolbarDiv = document.createElement('div');
		bottomToolbarDiv.id = 'bottom-toolbar';
		bottomToolbarDiv.className = 'toolbar';

		hud.append(bottomToolbarDiv);

		this.element = $('#bottom-toolbar');

		this.addComponent(UserTileComponent);
		this.addComponent(ChatComponent);

		this.addComponent(CapBar);

		this.addComponent(MenuComponent);
		this.addComponent(FeedbackComponent);
		this.addComponent(RelocateComponent);
		this.addComponent(NewShipComponent);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = BottomToolbarComponent;
}
