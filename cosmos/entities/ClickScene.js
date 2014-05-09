var ClickScene = IgeScene2d.extend({
	classId: 'ClickScene',

	init: function () {
		IgeScene2d.prototype.init.call(this);
		this.ignoreCamera(true);
		this.mouseDown(this.mouseDownHandler);

	},

	// Send message to server where in our game a mouse click occurred
	mouseDownHandler: function(event, control) {
		var data = {
			x: this.mousePosWorld().x,
			y: this.mousePosWorld().y
		};

		// TODO: Extend when clientState supports multiple current capabilities 
		if (ige.client.state !== undefined) {
			ige.client.state.currentCapability().tryPerformAction(this, event, data);
		}
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {	module.exports = ClickScene; }
