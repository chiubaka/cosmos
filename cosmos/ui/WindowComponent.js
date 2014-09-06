var WindowComponent = ButtonComponent.extend({
	classId: 'WindowComponent',

	button: undefined,
	window: undefined,
	numRows: undefined,

	init: function(windowUrl, windowId, buttonParent, buttonId, buttonClass, tooltip, tooltipPosition) {
		ButtonComponent.prototype.init.call(this, buttonParent, buttonId, buttonClass, tooltip, tooltipPosition);
		var self = this;

		var windows = $('#windows');
		if (windows.length === 0) {
			self.log('Window have not been initialized.', 'error');
			return;
		}

		// ButtonComponent saves the element with the given ID as 'element'. Rename this to button here for
		// convenience.
		self.button = self.element;

		HUDComponent.loadHtml(windowUrl, function(html) {
			windows.append(html);
			self.window = $('#' + windowId);

			self.button.click(function(event) {
				if (self.button.hasClass('active')) {
					self.close();
				}
				else {
					self.open();
					// cosmos:CargoComponent.buttonClicked
					// cosmos:CraftingUIComponent.buttonClicked
					ige.emit('cosmos:' + self.classId() + '.buttonClicked');
				}
			});

			self.table = self.window.find('table').first();

			self.numRows = 0;

			for (var i = 0; i < WindowComponent.MIN_ROWS; i++) {
				self.addRow();
			}

			self._onWindowLoaded();
		});
	},

	_onWindowLoaded: function() {

	},

	addRow: function() {
		var self = this;
		var row = $('<tr></tr>');
		for (var i = 0; i < WindowComponent.COLS_PER_ROW; i++) {
			row.append('<td></td>');
		}
		row.find('td').click(function() {
			self.select($(this));
		});
		this.table.append(row);
		this.numRows++;
	},

	removeRow: function() {
		// Don't remove rows past the minimum row setting!
		if (this.numRows <= WindowComponent.MIN_ROWS) {
			return;
		}
		this.table.find('tr').last().remove();
		this.numRows--;
	},

	setNumRows: function(numRows) {
		var rowDelta = numRows - this.numRows;
		if (rowDelta > 0) {
			for (var i = 0; i < rowDelta; i++) {
				this.addRow();
			}
		}
		else {
			for (var i = 0; i > rowDelta; i--) {
				this.removeRow();
			}
		}
	},

	drawBlockInCell: function(cell, blockType) {
	var blockTextureContainerDiv = cell.find('.block-texture-container');
		// If a container doesn't exist, create one
		if (blockTextureContainerDiv.length === 0) {
			blockTextureContainerDiv = $('<div></div>').addClass('block-texture-container');
		}
		// If a container already exists, empty it and recreate the elements inside of it
		else {
			blockTextureContainerDiv.empty();
		}

		var block = Block.fromType(blockType);

		// If this does not occur before the containerCanvas is appended, then the
		// containerCanvas will have a height and width of 0.
		cell.append(blockTextureContainerDiv);

		if (block instanceof Part) {
			var img = $('<img/>')[0];
			img.src = "/assets/sprites/" + block.iconFrame;
			blockTextureContainerDiv.append(img);
		}
		else {
			var containerCanvas = $('<canvas/>')[0];
			blockTextureContainerDiv.append(containerCanvas);

			containerCanvas.width = $(containerCanvas).width();
			containerCanvas.height = $(containerCanvas).height();

			var scaleWidth = containerCanvas.width / block._bounds2d.x;
			var scaleHeight = containerCanvas.height / block._bounds2d.y;
			var ctx = containerCanvas.getContext("2d");
			ctx.scale(scaleWidth, scaleHeight);
			ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
			block.texture().render(ctx, block);
		}

		return blockTextureContainerDiv;
	},

	select: function(cell) {

	},

	open: function() {
		this.window.fadeIn();
		this.button.addClass('active');
		this._resizeContainer();
	},

	close: function() {
		this.window.fadeOut(this._resizeContainer);
		this.button.removeClass('active');
	},

	_resizeContainer: function() {
		var visibleChildren = $('#windows').children(':visible');
		var width = 0;
		visibleChildren.each(function() {
			width += $(this).outerWidth(true);
		});
		$('#windows').width(width);
	}
});

WindowComponent.MIN_ROWS = 3;
WindowComponent.COLS_PER_ROW = 6;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = WindowComponent;
}
