var DescriptionComponent = IgeClass.extend({
	classId: 'DescriptionComponent',
	componentId: 'description',

	text: undefined,

	init: function(entity, data) {
		if (data === undefined || data.text === undefined) {
			this.log(JSON.stringify(data));
			this.log('Init parameters not provided for DescriptionComponent.', 'error');
			return;
		}

		// Take the dps as a parameter
		this.text = data.text;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DescriptionComponent; }
