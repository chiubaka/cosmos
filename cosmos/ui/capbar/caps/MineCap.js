var MineCap = Cap.extend({
	classId: 'MineCap',
	componentId: 'mineCap',

	active: undefined,

	init: function() {
		Cap.prototype.init.call(this, $('#cap-bar'), 'mine-cap');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MineCap;
}