var ButtonComponent = IgeEventingClass.extend({
	classId: 'ButtonComponent',

	element: undefined,

	init: function(parent, id, className, tooltip, tooltipPosition) {
		if (parent.length === 0) {
			this.log('Parent has not been initialized when creating button with id: ' + id + '.', 'error');
			return;
		}

		var buttonDiv = document.createElement('div');
		buttonDiv.id = id;
		if (className !== undefined) {
			buttonDiv.className = className;
		}

		$(buttonDiv).tooltipster({
				content: tooltip,
				delay: 0,
				position: tooltipPosition,
				theme: 'tooltip',
				maxWidth: '200'
		});

		parent.append(buttonDiv);

		this.element = $('#' + id);
	},

	// Shows and pins the tooltip for the button
	pinButtonTooltip: function() {
		this.element.tooltipster('showPin', 'tooltip-highlighted');
	},

	// Hides and unpins the tooltip for the button
	unpinButtonTooltip: function() {
		this.element.tooltipster('hideUnpin', 'tooltip');
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ButtonComponent;
}
