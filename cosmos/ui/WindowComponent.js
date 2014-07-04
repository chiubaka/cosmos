var WindowComponent = ButtonComponent.extend({
	classId: 'WindowComponent',

	button: undefined,
	window: undefined,

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

			for (var i = 0; i < WindowComponent.ROWS; i++) {
				self.addRow();
			}

			self._onWindowLoaded();
		});
	},

	_onWindowLoaded: function() {

	},

	addRow: function() {
		var row = $('<tr></tr>');
		for (var i = 0; i < WindowComponent.COLS_PER_ROW; i++) {
			row.append('<td></td>');
		}
		this.table.append(row);
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

WindowComponent.ROWS = 3;
WindowComponent.COLS_PER_ROW = 6;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = WindowComponent;
}