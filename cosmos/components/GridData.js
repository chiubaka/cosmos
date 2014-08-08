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
	},

	bounds: function() {
		var bounds = {};
		bounds.left = this.loc.x;
		bounds.top = this.loc.y;
		bounds.right = bounds.left + this.width;
		bounds.bottom = bounds.top + this.height;

		return bounds;
	},

	toJSON: function() {
		return {
			loc: {
				x: this.loc.x,
				y: this.loc.y,
			},
			width: this.width,
			height: this.height,
		};
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = GridData;
}