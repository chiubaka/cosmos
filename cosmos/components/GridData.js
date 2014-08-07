var GridData = IgeClass.extend({
	classId: 'GridData',
	componentId: 'gridData',

	location: undefined,
	width: undefined,
	height: undefined,

	init: function(width, height) {
		this.width = width;
		this.height = height;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = GridData;
}