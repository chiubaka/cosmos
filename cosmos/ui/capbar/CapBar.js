var CapBar = IgeUiElement.extend({
	classId: "CapBar",

	/**
	 * The height of the capbar.
	 */
	HEIGHT: 64,
	STUB_HEIGHT: 10,

	CAP_SPACING: 10,

	STUB_COLOR: 'rgb(70, 70, 70)',

	_caps: undefined,

	init: function() {
		this.log("init", 'info');
		IgeUiElement.prototype.init.call(this);

		this.applyStyle({
			'backgroundColor': 'rgb(30,30,30)',
			'borderBottomColor': this.STUB_COLOR,
			'borderBottomWidth': this.STUB_HEIGHT,
			'bottom': 0,
			'left': 0,
			'right': 0,
			'height': this.HEIGHT
		});

		this._caps = [];
		this._caps.push(new MineCap());
		this._caps.push(new ConstructCap());

		this.mountCaps();
	},

	mountCaps: function() {
		var numCaps = this._caps.length;
		var capbarWidth = (numCaps * this.HEIGHT) + ((numCaps - 1) * this.CAP_SPACING);

		for (var i = 0; i < this._caps.length; i++) {
			var cap = this._caps[i];

			var capCenterOffset = (cap.width() / 2);
			var capListPosOffset = (i - (numCaps / 2)) * (cap.width() + this.CAP_SPACING);
			var xPos = (capListPosOffset + capCenterOffset);

			cap.translateBy(xPos, cap.translate().y(), 0);
			cap.mount(this);
		}
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CapBar;
}
