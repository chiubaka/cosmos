var CargoUI = WindowComponent.extend({
	classId: 'CargoUI',
	componentId: 'cargo',

	_cargo: undefined,
	_numCellsFilled: undefined,

	itemMap: undefined,

	button: undefined,
	containers: undefined,
	emptyLabel: undefined,

	selectedType: undefined,
	cargoItems: undefined,

	init: function() {
		WindowComponent.prototype.init.call(
			this,
			CargoUI.UI_ROOT + 'cargo-window.html',
			'cargo-window',
			$('#left-toolbar'),
			'cargo-button',
			undefined,
			'Cargo',
			'right'
		);

		this.itemMap = {};
		this._numCellsFilled = 0;
	},

	open: function() {
		WindowComponent.prototype.open.call(this);
		this.refresh();
	},

	refresh: function() {
		// Don't bother spending the time to update the cargo window if the window is not visible.
		if (!this.window.is(':visible')) {
			return;
		}

		var changes = this._cargo.recentChanges();
		this._cargo.resetRecentChanges();

		var rowsNeeded = Math.ceil(this._cargo.numTypes() / WindowComponent.COLS_PER_ROW);
		this.setNumRows(rowsNeeded);

		/*var containers = this.table.find('td');
		containers.removeClass('active');
		containers.find('.tooltipstered').tooltipster('destroy');
		containers.removeAttr('data-block-type');*/

		var self = this;
		/*_.forOwn(changes, function(delta, type) {
			self.fillContainer(i, type, self._cargo.numItemsOfType(type));
			i++;
		});*/
		var cell;
		_.forOwn(changes, function(delta, type) {
			cell = self.itemMap[type];
			var quantity = self._cargo.numItemsOfType(type);

			// If a container already exists for this type, just modify the quantity.
			if (cell) {
				// TODO: If quantity is 0 and a container exists, remove the container and shift the
				// cells.
				if (quantity === 0) {
					var currRow = cell.parent();
					cell.remove();
					while (currRow.next().length !== 0) {
						var cellToShift = currRow.next().children().first();
						currRow.append(cellToShift);
						currRow = currRow.next();
					}

					var newCell = $('<td></td>');
					newCell.click(function() {
						self.select($(this));
					});
					currRow.append('<td></td>');
					delete self.itemMap[type];
					self._numCellsFilled--;
				}
				else {
					var quantitySpan = cell.find('.quantity').first();
					// Don't show the number if there is just one item.
					if (quantity === 1) {
						quantitySpan.text('');
					}
					else {
						cell.find('.quantity').first().text(quantity);
					}
				}
			}
			// No container already exists. We must find one and fill one.
			else {
				cell = self.table.find('td').eq(self._numCellsFilled);
				self.fillCell(cell, type, quantity);
				self._numCellsFilled++;
				self.itemMap[type] = cell;
			}
		});
		console.log("Refreshing cargo.");
		console.log(this._cargo.recentChanges());
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

	fillCell: function(cell, type, quantity) {
		var blockCanvasContainerDiv = this.drawBlockInContainer(cell, type);

		// Don't add a label if there's only one block of this type
		var quantitySpan = $('<span></span>').addClass('quantity');
		if (quantity > 1) {
			quantitySpan.text(quantity);
		}
		blockCanvasContainerDiv.append(quantitySpan);

		$(cell).attr('data-block-type', type);

		if (this.selectedType === type) {
			this.select($(cell));
		}

		this.fillTooltip(type, cell);

		cell.mouseover(function() {
			ige.hud.inspector.inspect(cosmos.blocks.instances[type]);
		});

		cell.mouseout(function() {
			ige.hud.inspector.hide();
		});
	},

	fillTooltip: function(type, cell) {
		var content = Block.displayNameFromClassId(type);

		cell.tooltipster({
			content: content,
			delay: 0,
			position: 'bottom',
			theme: 'tooltip cargo',
			maxWidth: '200'
		});
	},

	_onWindowLoaded: function() {
		var self = this;

		// TODO: At some point when the player's active ship can change, we need to switch which
		// cargo the UI is tracking.
		ige.on('cosmos:client.player.currentShip.ready', function() {
			self._cargo = ige.client.player.currentShip().cargo;

			self._cargo.on('add', self.refresh.bind(self));
			self._cargo.on('remove', self.refresh.bind(self));
		});

		ige.emit('cosmos:hud.leftToolbar.windows.subcomponent.loaded', this);
	}
});

CargoUI.UI_ROOT = '/components/cargo/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CargoUI;
}
