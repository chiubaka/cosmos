var ConstructCapComponent = ButtonComponent.extend({
	classId: 'ConstructCapComponent',
	componentId: 'constructCap',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#cap-bar'), 'construct-cap');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = ConstructCapComponent;
}