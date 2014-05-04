var CapBar = IgeUiElement.extend({
	classId: "CapBar",

	/**
	 * The height of the capbar.
	 */
	HEIGHT: 40,

	CAP_SPACING: 10,

	_caps: undefined,

	init: function() {
		console.log("Initializing Capbar...");
		IgeEntity.prototype.init.call(this);

		this.applyStyle({
			'backgroundColor': '#dddddd',
			'borderColor': 'rgba(0,0,0,0)',
			'bottom': 0,
			'height': this.HEIGHT
		});

		this._caps = [];
		this._caps.push(new MineCap());
		this._caps.push(new ConstructCap());

		this.mountCaps();
	},

	mountCaps: function() {
		var capbarWidth = this.width();
		var capbarCenter = capbarWidth / 2;
		var numCaps = this._caps.length;

		for (var i = 0; i < this._caps.length; i++) {
			var cap = this._caps[i];

			var capOriginOffset = (cap.width() / 2);
			var capFromCenterOffset = ((cap.width() + this.CAP_SPACING) * ((numCaps - 1) / 2 - i));
			var xPos = capbarCenter - capOriginOffset - capFromCenterOffset;

			cap.translateTo(xPos, cap.translate().y(), 0);
			cap.mount(this);
		}
	}
});