﻿var CapBar = IgeUiElement.extend({
	classId: "CapBar",

	/**
	 * The height of the capbar.
	 */
	HEIGHT: 64,

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
		var numCaps = this._caps.length;
		var capbarWidth = (numCaps * this.HEIGHT) + ((numCaps - 1) * this.CAP_SPACING);
		var capbarCenter = capbarWidth / 2;
		this.width(capbarWidth);

		for (var i = 0; i < this._caps.length; i++) {
			var cap = this._caps[i];

			var capCenterOffset = (cap.width() / 2);
			var capListPosOffset = (i - (numCaps / 2)) * (cap.width() + this.CAP_SPACING);
			var spacingTweak = (this.CAP_SPACING / 2);
			var xPos = (capListPosOffset + capCenterOffset + spacingTweak);

			cap.translateBy(xPos, cap.translate().y(), 0);
			cap.mount(this);
		}
	}
});