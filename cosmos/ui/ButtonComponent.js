var ButtonComponent = IgeEventingClass.extend({
	classId: 'ButtonComponent',

	element: undefined,

	init: function(parent, id, className) {
		if (parent.length === 0) {
			this.log('Parent has not been initialized when creating button with id: ' + id + '.', 'error');
			return;
		}

		var div = document.createElement('div');
		div.id = id;
		if (className !== undefined) {
			div.className = className;
		}

		parent.append(div);

		this.element = $('#' + id);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ButtonComponent;
}