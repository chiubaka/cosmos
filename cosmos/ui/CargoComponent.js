var CargoComponent = WindowComponent.extend({
	classId: 'CargoComponent',
	componentId: 'cargo',

	button: undefined,
	pullout: undefined,
	containers: undefined,
	cargoBlocks: undefined,
	emptyLabel: undefined,

	selectedType: undefined,
	cargoItems: undefined,

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
			self.populateFromInventory(cargoItems);
		});

		ige.on('cargo update', function(cargoItems) {
			self.populateFromInventory(cargoItems);
		});

		ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
	},

	select: function(container) {
		// If the user selects an empty container, do nothing.
		var blockType = container.attr('data-block-type');
		if (blockType === undefined) {
			return;
		}

		// Otherwise, select the container, mark it as active
		this.table.find('td').removeClass('active');
		container.addClass('active');
		this.selectedType = container.attr('data-block-type');
		ige.emit('toolbar tool selected', [this.classId(), container.attr('data-block-type')]);
	},

	populateFromInventory: function(cargoItems) {
		// Update client-side list of cargo
		// TODO: In the future, move this to the yet-to-be-implemented client side
		// cargo model
		this.cargoItems = cargoItems;
		var numTypes = Object.keys(cargoItems).length;
		console.log('Populating toolbar from server response: ' + numTypes + ' item(s) in inventory');

		var rowsNeeded = Math.ceil(numTypes / WindowComponent.COLS_PER_ROW);
		this.setNumRows(rowsNeeded);

		var containers = this.table.find('td');
		containers.removeClass('active');
		containers.find('.tooltipstered').tooltipster('destroy');
		containers.removeAttr('data-block-type');

		var blockCanvasContainerDivs = this.table.find('.block-canvas-container');
		blockCanvasContainerDivs.remove();
		// Destroy old tooltips
		var tooltipsteredCells = this.table.find('.tooltipstered');
		_.map(tooltipsteredCells, function(cell){$(cell).tooltipster('destroy')})

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

		container.mouseover(function() {
			ige.hud.inspector.inspect(cosmos.blocks.instances[type]);
		});

		container.mouseout(function() {
			ige.hud.inspector.hide();
		});
	},

	fillTooltip: function(type, container) {
		var content = Block.displayNameFromClassId(type);

		container.tooltipster({
			content: content,
			delay: 0,
			position: 'bottom',
			theme: 'tooltip cargo',
			maxWidth: '200'
		});
	}
});

CargoComponent.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoComponent;
}
