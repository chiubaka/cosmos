var CargoComponent = IgeEventingClass.extend({
	classId: 'CargoComponent',
	componentId: 'cargo',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	cargoBlocks: undefined,
	emptyLabel: undefined,

	selectedType: undefined,

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
			self.emptyLabel = self.element.find('#cargo-empty-label');

			self.button.click(function() {
				if (self.pullout.is(':visible')) {
					self.close();
				}
				else {
					self.open();
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

			ige.emit('cosmos:hud.subcomponent.loaded', self);
		});
	},

	open: function() {
		this.pullout.show();
		this.button.addClass('active');
	},

	close: function() {
		this.pullout.hide();
		this.button.removeClass('active');
	},

	deselect: function(container) {
		container.removeClass('active');
		this.selectedType = undefined;
		ige.emit('toolbar tool cleared', [this.classId(), container.attr('data-block-type')]);
	},

	select: function(container) {
		$('.container').removeClass('active');
		container.addClass('active');
		this.selectedType = container.attr('data-block-type');
		ige.emit('toolbar tool selected', [this.classId(), container.attr('data-block-type')]);
	},

	populateFromInventory: function(cargoItems) {
		console.log('Populating toolbar from server response: ' + Object.keys(cargoItems).length + ' item(s) in inventory');

		this.containers.find('.container').remove();

		if (Object.keys(cargoItems).length > 0) {
			this.emptyLabel.hide();
		}
		else {
			this.emptyLabel.show();
		}

		for (var type in cargoItems) {
			var quantity = cargoItems[type];
			this.createContainer(type, quantity);
		}

		if (this.selectedType === undefined || !cargoItems.hasOwnProperty(this.selectedType)) {
			this.select(this.containers.find('.container').first());
		}
	},

	createContainer: function(type, quantity) {
		var self = this;
		var containerDiv = document.createElement('div');
		$(containerDiv).addClass('container');

		if (this.selectedType === type) {
			$(containerDiv).addClass('active');
		}

		$(containerDiv).attr('data-block-type', type);


		$(containerDiv).click(function() {
			if ($(this).hasClass('active')) {
				self.deselect($(this));
			}
			else {
				self.select($(this));
			}
		});

		var quantityLabelSpan = document.createElement('span');
		$(quantityLabelSpan).addClass('quantity-label');
		$(quantityLabelSpan).text(quantity);

		var typeLabelSpan = document.createElement('span');
		$(typeLabelSpan).addClass('type-label');
		$(typeLabelSpan).text(Block.displayNameFromClassId(type));

		var containerCanvas = document.createElement('canvas');

		$(containerDiv).append(typeLabelSpan);
		$(containerDiv).append(quantityLabelSpan);
		$(containerDiv).append(containerCanvas);
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