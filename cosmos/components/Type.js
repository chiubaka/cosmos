var Type = IgeClass.extend({
	classId: 'Type',
	componentId: 'type',

	text: undefined,

	init: function(entity, data) {
		if (data === undefined || data.text === undefined) {
			this.log('Init parameters not provided for Type.', 'error');
			return;
		}

		// Take the text as a parameter
		this.text = data.text;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Type; }
