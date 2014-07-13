/**
 * The ClickScene is a scene that intercepts all clicks on the background.
 * Think of it like a catch-all for all clicks that aren't intercepted by an actual entity above this scene.
 * @class
 * @typedef {ClickScene}
 * @namespace
 */
var ClickScene = IgeScene2d.extend({
	classId: 'ClickScene',

	init: function () {
		IgeScene2d.prototype.init.call(this);
		this.ignoreCamera(true);
		this.mouseDown(this._mouseDownHandler);
	},

	/**
	 * Handles mouse clicks on the ClickScene. Sends a message to the server about where in the game a mouse click has
	 * occurred.
	 * @param event {Object} The event object associated with the click.
	 * @param control {Object} The control object associated with the click.
	 * @memberof ClickScene
	 * @private
	 * @instance
	 */
	_mouseDownHandler: function(event, control) {
		var data = {
			x: this.mousePosWorld().x,
			y: this.mousePosWorld().y
		};

		// TODO: Extend when clientState supports multiple current capabilities
		if (ige.client.state !== undefined) {
			ige.client.state.currentCapability().tryPerformAction(this, event, data);
		}

		ige.emit('cosmos:background.mousedown');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {	module.exports = ClickScene; }
