var NewShipComponent = ButtonComponent.extend({
	classId: 'NewShipComponent',
	componentId: 'newShip',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'new-ship-button');
		this.element.click(this.mouseDown);
	},

	mouseDown: function() {
		ige.network.send('new ship');
		ige.emit('new ship button clicked');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NewShipComponent;
}