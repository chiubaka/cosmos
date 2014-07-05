var WindowComponent = ButtonComponent.extend({
	classId: 'WindowComponent',

	button: undefined,
	window: undefined,
	numRows: undefined,

	init: function(windowUrl, windowId, buttonParent, buttonId, buttonClass, tooltip) {
		ButtonComponent.prototype.init.call(this, buttonParent, buttonId, buttonClass, tooltip);
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
		console.log('adding row');
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

	drawBlockInContainer: function(container, blockType) {
		var containerCanvas = $('<canvas/>')[0];
		container.append(containerCanvas);

		var block = Block.blockFromClassId(blockType);

		containerCanvas.width = $(containerCanvas).width();
		containerCanvas.height = $(containerCanvas).height();

		var scaleWidth = containerCanvas.width / block._bounds2d.x;
		var scaleHeight = containerCanvas.height / block._bounds2d.y;
		var ctx = containerCanvas.getContext("2d");
		ctx.scale(scaleWidth, scaleHeight);
		ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
		block.texture().render(ctx, block);
		setTimeout(function() {
			block.texture().render(ctx, block);
		});
	},

	select: function(container) {
		this.table.find('td').removeClass('active');
		container.addClass('active');
	},

	open: function() {
		this.window.fadeIn();
		this.button.addClass('active');
		this._resizeContainer();
	},

	close: function() {
		this.window.fadeOut();
		this.button.removeClass('active');
		this._resizeContainer();
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
