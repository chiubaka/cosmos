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
		return {
			left: this.loc.x,
			top: this.loc.y,
			right: this.loc.x + this.width - 1,
			bottom: this.loc.y + this.height - 1
		};
	},

	toJSON: function() {
		return {
			loc: {
				x: this.loc.x,
				y: this.loc.y
			},
			width: this.width,
			height: this.height
		};
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = GridData;
}
