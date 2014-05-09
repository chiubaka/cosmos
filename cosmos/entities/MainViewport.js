var MainViewport = IgeViewport.extend({
	classId: "MainViewport",

	update: function(ctx, tickDelta) {
		if (!ige.isServer) {
			var rect = this.viewArea();
			console.log(rect.x2 + ' ' + rect.y2);
		}

		IgeViewport.prototype.update.call(this, ctx, tickDelta);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = MainViewport;
}