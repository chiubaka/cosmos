var HUDComponent = IgeEventingClass.extend({
	classId: 'HUDComponent',
	componentId: 'hud',

	element: undefined,
	numComponentsToLoad: undefined,

	init: function() {
		var self = this;
		var hudDiv = document.createElement('div');
		hudDiv.id = 'hud';
		$('body').append(hudDiv);

		this.element = $('#hud');

		this.hide();

		this.numComponentsToLoad = 5;

		// Track how many of the other HUD components have loaded. Emit an event when everything is done.
		ige.on('cosmos:hud.subcomponent.loaded', function(component) {
			self.numComponentsToLoad--;
			if (self.numComponentsToLoad === 0) {
				ige.emit('cosmos:hud.loaded', self);
			}
		});

		this.addComponent(BottomToolbarComponent);
		this.addComponent(LeftToolbarComponent);
		this.addComponent(MinimapComponent);
		this.addComponent(Inspector);
		this.addComponent(NotificationUIComponent);
	},

	show: function() {
		this.element.show();
	},

	hide: function() {
		this.element.hide();
	}
});

HUDComponent.loadHtml = function(url, callback) {
	$.ajax({
		url: url,
		success: callback,
		dataType: 'html',
		async: false
	});
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HUDComponent;
}
