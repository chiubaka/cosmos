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

			self._onWindowLoaded();
		});
	},

	_onWindowLoaded: function() {

	},

	open: function() {
		this.window.show();
		this.button.addClass('active');
	},

	close: function() {
		this.window.hide();
		this.button.removeClass('active');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = WindowComponent;
}