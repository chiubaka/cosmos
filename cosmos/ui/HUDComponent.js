var HUDComponent = IgeEventingClass.extend({
	classId: 'HUDComponent',
	componentId: 'hud',

	element: undefined,

	init: function() {
		var hudDiv = document.createElement('div');
		hudDiv.id = 'hud';
		$('body').append(hudDiv);

		this.element = $('#hud');

		// TODO: Start HUD in hidden mode.
		// this.hide();

		this.addComponent(BottomToolbarComponent);
		this.addComponent(MinimapComponent);
		this.addComponent(CargoComponent);
		//this.addComponent(InspectorComponent);
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