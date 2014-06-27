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

			ige.on('cargo response', function(cargoItems) {
				console.log('Received cargo response');
				self.populateFromInventory(cargoItems);
			});

			ige.on('cargo update', function(cargoItems) {
				console.log('Received cargo update', 'info');
				self.populateFromInventory(cargoItems);
			});


		});
	},

	deselect: function(container) {
		container.removeClass('active');
		ige.emit('toolbar tool cleared', [this.classId(), container.data('data-block-type')]);
	},

	select: function(container) {
		$('.container').removeClass('active');
		container.addClass('active');
		ige.emit('toolbar tool selected', [this.classId(), container.data('data-block-type')]);
	},

	populateFromInventory: function(cargoItems) {
		var selectedType = ige.client.state.currentCapability().selectedType;
		console.log('Populating toolbar from server response: " + Object.keys(cargoItems).length + " item(s) in inventory');

		this.containers.empty();

		for (var type in cargoItems) {
			var quantity = cargoItems[type];
			this.createContainer(type, quantity);
		}

		var needToReselect = (selectedType !== undefined && !cargoItems.hasOwnProperty(selectedType));
	},

	createContainer: function(type, quantity) {
		var self = this;
		var containerDiv = document.createElement('div');
		containerDiv.className = 'container';
		containerDiv.setAttribute('data-block-type', type);

		$(containerDiv).click(function() {
			if ($(this).hasClass('active')) {
				self.deselect($(this));
			}
			else {
				self.select($(this));
			}
		});

		var quantityLabelSpan = document.createElement('span');
		quantityLabelSpan.className = 'quantityLabel';
		quantityLabelSpan.innerHTML = quantity;

		var containerCanvas = document.createElement('canvas');

		containerDiv.appendChild(quantityLabelSpan);
		containerDiv.appendChild(containerCanvas);
		this.containers.append(containerDiv);

		var block = Block.blockFromClassId(type);
		containerCanvas.height = block._bounds2d.y;
		containerCanvas.width = block._bounds2d.x;

		var ctx = containerCanvas.getContext("2d");
		ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
		block.texture().render(ctx, block);
		setTimeout(function() {
			block.texture().render(ctx, block);
		}, 100);
	}
});

CargoComponent.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoComponent;
}