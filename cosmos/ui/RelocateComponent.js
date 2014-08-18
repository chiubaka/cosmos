var RelocateComponent = ButtonComponent.extend({
	classId: 'RelocateComponent',
	componentId: 'relocate',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'relocate-button', undefined, 'Relocate', 'top');

		this.element.click(this.mouseDown);

		ige.emit('cosmos:hud.bottomToolbar.subcomponent.loaded', this);
	},

	mouseDown: function() {
		ige.network.send('relocate');
		ige.emit('relocate button clicked');
		ige.hud.bottomToolbar.relocate.emit('cosmos:RelocateComponent.mouseDown');
		ige.client.metrics.track('cosmos:player.relocate.mouseDown');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RelocateComponent;
}
