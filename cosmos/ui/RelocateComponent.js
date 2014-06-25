var RelocateComponent = ButtonComponent.extend({
	classId: 'RelocateComponent',
	componentId: 'relocate',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'relocate-button');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RelocateComponent;
}