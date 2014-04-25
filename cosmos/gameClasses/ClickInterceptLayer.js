var ClickInterceptLayer = IgeEntity.extend({
	classId: 'ClickInterceptLayer',

	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.width(6145 * 2);
			this.height(6623 * 2);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ClickInterceptLayer; }
