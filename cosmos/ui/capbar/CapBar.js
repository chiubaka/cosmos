/**
 * A CapBar represents the base, most generic HUD bar upon which Cap UI elements
 * are placed. The CapBar, together with its constituent Caps, represent the 
 * primary UI method with which the player can interface with the game's tools and
 * interact with the environment.
 *
 * The CapBar is intended to be a client singleton instantiated and managed by the
 * {@link HUDManager}.
 *
 * @class
 * @typedef {Object} CapBar
 * @namespace  
 */
var CapBar = IgeUiElement.extend({
	classId: "CapBar",

	/**
	 * The default height of the CapBar.
	 * @constant {number}
	 * @default
	 * @memberof CapBar
	 * @instance
	 */
	HEIGHT: 64,

	/**
	 * The default height of the CapBar's bottom border ('stub').
	 * @constant {number}
	 * @default
	 * @memberof CapBar
	 * @instance
	 */
	STUB_HEIGHT: 10,

	/**
	 * The default number of pixels of spacing to leave between each Cap in the CapBar.
	 * @constant {number}
	 * @default
	 * @memberof CapBar
	 * @instance
	 */
	CAP_SPACING: 10,

	/**
	 * The default RGB Color of CapBar's stub.
	 * @constant {string}
	 * @default
	 * @memberof CapBar
	 * @instance
	 */
	STUB_COLOR: 'rgb(70, 70, 70)',

	/**
	 * The default RGB Color of CapBar's background.
	 * @constant {string}
	 * @default
	 * @memberof CapBar
	 * @instance
	 */
	BG_COLOR: 'rgb(30,30,30)',

	/**
	 * An array of the Caps hosted by the CapBar. Each of these Caps is mounted
	 * to the CapBar entity in the IGE Scenegraph.
	 * @memberof CapBar
	 * @type {Array}
	 * @private
	 * @instance
	 */
	_caps: undefined,

	/**
	 * Initializes the CapBar, sets up its UI styling, adds instances of the default
	 * Caps to the CapBar.
	 * @memberof CapBar
	 * @instance
	 * @todo Accept an optional data param to initialize the CapBar with a different set of Caps.
	 */
	init: function() {
		IgeUiElement.prototype.init.call(this);

		this.applyStyle({
			'backgroundColor': this.BG_COLOR,
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

	/**
	 * Mounts all of the Caps to the CapBar and arranges them with correct spacing
	 * and appropriate centering.
	 * @memberof CapBar
	 * @instance
	 */
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
