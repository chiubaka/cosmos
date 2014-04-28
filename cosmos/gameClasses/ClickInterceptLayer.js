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
		console.log("TEST");

		var data = {
			x: 0,
			y: 0
		};//TODO make these not 0

		ige.network.send('backgroundClicked', data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ClickInterceptLayer; }
