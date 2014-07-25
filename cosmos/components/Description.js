var Description = IgeClass.extend({
	classId: 'Description',
	componentId: 'description',

	text: undefined,

	init: function(entity, data) {
		if (data === undefined || data.text === undefined) {
			this.log('Init parameters not provided for Description.', 'error');
			return;
		}

		// Take the text as a parameter
		this.text = data.text;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Description; }
