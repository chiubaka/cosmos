var CargoComponent = IgeEventingClass.extend({
	classId: 'CargoComponent',
	componentId: 'cargo',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	cargoBlocks: undefined,

	init: function() {
		var self = this;
		var hud = $('#hud');
		if (hud.length === 0) {
			self.log('HUD has not been initialized.', 'error');
			return;
		}

		self.cargoBlocks = {};

		HUDComponent.loadHtml(CargoComponent.UI_ROOT + 'cargo.html', function(html) {
			hud.append(html);
			self.element = $('#cargo');
			self.button = self.element.find('.button').first();
			self.pullout = self.element.find('.pullout').first();
			self.containers = self.element.find('#cargo-containers');

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

			ige.on('cosmos:Player.addBlock.cargoBlock', function(cargoBlockId) {
				var containerDiv = document.createElement('div');
				containerDiv.className = 'container';

				self.cargoBlocks[cargoBlockId] = containerDiv;

				self.containers.append(containerDiv);
			});

			ige.on('cosmos:Player.removeBlock.cargoBlock', function(cargoBlockId) {
				var containerDiv = self.cargoBlocks[cargoBlockId];
				containerDiv.remove();
				delete self.cargoBlocks[cargoBlockId];
			});
		});
	}
});

CargoComponent.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoComponent;
}