var ConstructCap = Cap.extend({
	classId: 'ConstructCap',
	componentId: 'constructCap',

	init: function() {
		Cap.prototype.init.call(this, $('#cap-bar'), 'construct-cap');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructCap;
}