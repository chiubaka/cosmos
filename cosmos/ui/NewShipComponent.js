var NewShipComponent = ButtonComponent.extend({
	classId: 'NewShipComponent',
	componentId: 'newShip',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'new-ship-button');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NewShipComponent;
}