var ButtonComponent = IgeEventingClass.extend({
	classId: 'ButtonComponent',

	element: undefined,

	init: function(parent, id, className, tooltip) {
		if (parent.length === 0) {
			this.log('Parent has not been initialized when creating button with id: ' + id + '.', 'error');
			return;
		}

		var buttonDiv = document.createElement('div');
		buttonDiv.id = id;
		if (className !== undefined) {
			buttonDiv.className = className;
		}

		var tooltipSpan = document.createElement('span');
		$(tooltipSpan).addClass('tooltip');
		$(tooltipSpan).text(tooltip);

		$(buttonDiv).append(tooltipSpan);

		parent.append(buttonDiv);

		this.element = $('#' + id);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ButtonComponent;
}