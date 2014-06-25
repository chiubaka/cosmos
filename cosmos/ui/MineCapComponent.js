var MineCapComponent = ButtonComponent.extend({
	classId: 'MineCapComponent',
	componentId: 'mineCap',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#cap-bar'), 'mine-cap');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MineCapComponent;
}