/**
 * Manages the UI for the Cargo Window.
 * @author Daniel Chiu
 */
var CargoUI = WindowComponent.extend({
	classId: 'CargoUI',
	componentId: 'cargo',

	button: undefined,
	selectedType: undefined,

	_cargo: undefined,
	_itemMap: undefined,
	_numCellsFilled: undefined,

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

		this._itemMap = {};
		this._numCellsFilled = 0;
	},

	open: function() {
		WindowComponent.prototype.open.call(this);
		this.refresh();

		if (!this.selectedType) {
			this.selectFirst();
		}
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

		var self = this;
		var cell;
		_.forOwn(changes, function(delta, type) {
			cell = self._itemMap[type];
			var quantity = self._cargo.numItemsOfType(type);

			// If a container already exists for this type, just modify the quantity.
			if (cell) {
				// TODO: If quantity is 0 and a container exists, remove the container and shift the
				// cells.
				if (quantity === 0) {
					self._numCellsFilled--;
					var currRow = cell.parent();

					// If we now have no cells filled, then there is no selected type.
					if (self._numCellsFilled === 0) {
						self.selectedType = undefined;
					}
					// If this was the selected cell, try to select the next cell. If select returns
					// false, that means the next cell was not selectable (i.e. empty), so select
					// the first cell. There must be an item in the first cell because we know in
					// this case that _numCellsFilled > 0.
					else if (cell.hasClass('active') && !self.select(cell.next())) {
						self.selectFirst();
					}
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
					delete self._itemMap[type];
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

					// If something has been added and there currently isn't a selected type, we
					// should select this.
					if (!self.selectedType) {
						self.select(cell);
					}
				}
			}
			// No cell already exists. We must find one and fill one.
			else {
				cell = self.table.find('td').eq(self._numCellsFilled);
				self.fillCell(cell, type, quantity);
				self._numCellsFilled++;
				self._itemMap[type] = cell;
			}
		});
	},

	select: function(cell) {
		// If the user selects an empty cell, do nothing.
		var blockType = cell.attr('data-block-type');
		if (blockType === undefined) {
			return false;
		}

		// Otherwise, select the cell, mark it as active
		this.table.find('td').removeClass('active');
		this.selectedType = blockType;
		cell.addClass('active');
		return true;
	},

	selectFirst: function() {
		this.select(this.table.find('td').first());
	},

	fillCell: function(cell, type, quantity) {
		var blockCanvasCellDiv = this.drawBlockInCell(cell, type);

		// Don't add a label if there's only one block of this type
		var quantitySpan = $('<span></span>').addClass('quantity');
		if (quantity > 1) {
			quantitySpan.text(quantity);
		}
		blockCanvasCellDiv.append(quantitySpan);

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
