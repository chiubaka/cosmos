var CargoComponent = IgeEventingClass.extend({
	classId: 'CargoComponent',
	componentId: 'cargo',

	button: undefined,
	pullout: undefined,

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
			self.button = self.element.find('.button').first();
			self.pullout = self.element.find('.pullout').first();
			console.log(self.button);
			console.log(self.pullout);

			self.button.click(function() {
				if (self.pullout.is(':visible')) {
					self.pullout.hide();
					self.button.removeClass('active');
				}
				else {
					self.pullout.show();
					self.button.addClass('active');
				}
			});
		});
	}
});

CargoComponent.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoComponent;
}