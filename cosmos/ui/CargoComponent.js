var CargoComponent = IgeEventingClass.extend({
	classId: 'CargoComponent',
	componentId: 'cargo',

	init: function() {
		var self = this;
		var hud = $('#hud');
		if (hud.length === 0) {
			self.log('HUD has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(CargoComponent.UI_ROOT + 'cargo.html', function(html) {
			hud.append(html);
			self.element = $('#cargo');
			self.button = self.element.find('.button');
			self.popout = self.element.find('.popout');


		});
	}
});

CargoComponent.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoComponent;
}