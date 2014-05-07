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

		ige.network.send('backgroundClicked', data);
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {	module.exports = ClickScene; }
