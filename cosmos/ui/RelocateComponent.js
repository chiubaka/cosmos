var RelocateComponent = ButtonComponent.extend({
	classId: 'RelocateComponent',
	componentId: 'relocate',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'relocate-button', undefined, 'Relocate');

		this.element.click(this.mouseDown);
	},

	mouseDown: function() {
		ige.network.send('relocate');
		ige.emit('relocate button clicked');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RelocateComponent;
}