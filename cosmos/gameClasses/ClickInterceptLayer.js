var ClickInterceptLayer = IgeEntity.extend({
	classId: 'ClickInterceptLayer',

	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.width(6145 * 2);
			this.height(6623 * 2);
		}

		this.mouseDown(this.mouseDownHandler);
	},

	/**
	 * Intercept clicks and create a new block grid wherever the user clicked
	 */
	mouseDownHandler: function(event, control) {
		console.log(event);
		var data = {
			x: this.mousePosWorld().x,
			y: this.mousePosWorld().y
		};//TODO make these not 0

		ige.network.send('backgroundClicked', data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ClickInterceptLayer; }
