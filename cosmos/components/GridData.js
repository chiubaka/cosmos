var GridData = IgeClass.extend({
	classId: 'GridData',
	componentId: 'gridData',

	loc: undefined,
	grid: undefined,

	width: undefined,
	height: undefined,

	init: function(entity, data) {
		this.width = data.width;
		this.height = data.height;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = GridData;
}