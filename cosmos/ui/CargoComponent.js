var CargoComponent = WindowComponent.extend({
	classId: 'CargoComponent',
	componentId: 'cargo',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	cargoBlocks: undefined,
	emptyLabel: undefined,

	selectedType: undefined,

	init: function() {
		WindowComponent.prototype.init.call(
			this,
			CargoComponent.UI_ROOT + 'cargo-window.html',
			'cargo-window',
			$('#left-toolbar'),
			'cargo-button',
			undefined,
			'Cargo',
			'right'
		);
	},

	_onWindowLoaded: function() {
		var self = this;
		ige.on('cargo response', function(cargoItems) {
			console.log('Received cargo response');
			self.populateFromInventory(cargoItems);
		});

		ige.on('cargo update', function(cargoItems) {
			console.log('Received cargo update', 'info');
			self.populateFromInventory(cargoItems);
		});

		ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
	},

	select: function(container) {
		WindowComponent.prototype.select.call(this, container);
		this.selectedType = container.attr('data-block-type');
		ige.emit('toolbar tool selected', [this.classId(), container.attr('data-block-type')]);
	},

	populateFromInventory: function(cargoItems) {
		var numTypes = Object.keys(cargoItems).length;
		console.log('Populating toolbar from server response: ' + numTypes + ' item(s) in inventory');

		var rowsNeeded = Math.ceil(numTypes / WindowComponent.COLS_PER_ROW);
		this.setNumRows(rowsNeeded);

		var containers = this.table.find('td');
		containers.removeClass('active');
		containers.removeAttr('data-block-type');

		var canvases = this.table.find('canvas')
		if (canvases.length > 0) {
			canvases.remove();
		}

		var index = 0;
		for (var type in cargoItems) {
			if (!cargoItems.hasOwnProperty(type)) {
				continue;
			}

			var quantity = cargoItems[type];
			this.fillContainer(index, type, quantity);

			index++;
		}

		if ((this.selectedType === undefined || !cargoItems.hasOwnProperty(this.selectedType)) && numTypes > 0) {
			this.select(this.table.find('td').first());
		}
	},

	fillContainer: function(index, type, quantity) {
		var container = this.table.find('td').eq(index);
		var blockCanvasContainerDiv = this.drawBlockInContainer(container, type);

		// Don't add a label if there's only one block of this type
		if (quantity > 1) {
			var quantitySpan = $('<span></span>').addClass('quantity').text(quantity);
			blockCanvasContainerDiv.append(quantitySpan);
		}

		$(container).attr('data-block-type', type);

		if (this.selectedType === type) {
			this.select($(container));
		}

		this.fillTooltip(type, container);
	},

	fillTooltip: function(type, container) {
		var content = Block.displayNameFromClassId(type);
		if (container.hasClass('tooltipstered')) {
			container.tooltipster('content', content);
		}
		else {
			container.tooltipster({
				content: content,
				delay: 0,
				position: 'bottom',
				theme: 'tooltip cargo',
				maxWidth: '200'
			});
		}
	}
});

CargoComponent.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoComponent;
}
