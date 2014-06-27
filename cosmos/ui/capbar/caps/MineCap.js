var MineCap = Cap.extend({
	classId: 'MineCap',
	componentId: 'mineCap',

	active: undefined,

	init: function() {
		Cap.prototype.init.call(this, $('#cap-bar'), 'mine-cap', undefined, 'Mine');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MineCap;
}