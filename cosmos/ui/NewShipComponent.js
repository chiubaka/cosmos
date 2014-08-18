var NewShipComponent = ButtonComponent.extend({
	classId: 'NewShipComponent',
	componentId: 'newShip',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'new-ship-button', undefined, 'New Ship', 'top');
		this.element.click(this.mouseDown);

		ige.emit('cosmos:hud.bottomToolbar.subcomponent.loaded', this);
	},

	mouseDown: function() {
		ige.client.metrics.track('cosmos:player.newShip.mouseDown');
		
		var message = "Whoa! This will destroy your current ship and cargo." + "<br>" +
			"Do you want to continue?";

		alertify.set({ buttonFocus: "cancel" }); // "none", "ok", "cancel"
		alertify.confirm(message, function (e) {
			if (e) {
				ige.network.send('new ship');
				ige.emit('new ship button clicked');
			}
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NewShipComponent;
}
