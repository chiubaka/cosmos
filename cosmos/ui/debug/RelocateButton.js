/**
 * The RelocateButton provides players with a quick way to teleport their ship
 * in a new location.
 *
 * @class
 * @typedef {Object} RelocateButton
 * @namespace  
 */
 var RelocateButton = IgeUiButton.extend({
	classId: "RelocateButton",

	/**
	 * The width of the button.
	 * @constant {number}
	 * @default
	 * @memberof RelocateButton
	 * @instance
	 */
	WIDTH: 128,

	/**
	 * The height of the button.
	 * @constant {number}
	 * @default
	 * @memberof RelocateButton
	 * @instance
	 */
	HEIGHT: 64,

	/**
	 * Initializes the Button's styles, label, and attaches event emitters to relay
	 * player interaction events.
	 * @memberof RelocateButton
	 * @instance
	 */
	init: function() {
		IgeUiButton.prototype.init.call(this);

		this.log('init', 'info');

		// Set up the styling for this capability
		this.initStyles();

		// Set up labels
		this.initLabel();

		// Set up events
		this.initEvents();

		// For some reason this makes clicking the button work more consistently. Before adding this, I was having
		// a problem where clicking on the button would go to the background ~half the time and to the button
		// the other half of the time. With this, I just can't click the button until the camera seems to have
		// settled on the ship again, which is convenient.
		this.allowActive(false);
	},

	/**
	 * Initializes the Button's styles.
	 * @memberof RelocateButton
	 * @instance
	 */
	initStyles: function() {
		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		this.ID_NORMAL = this.classId();
		this.ID_HOVER = this.classId() + ':hover';
		this.ID_SELECTED = this.classId() + ':selected';
		this.ID_SELECTED_HOVER = this.classId() + ':selected:hover';

		this.applyStyle({
			'backgroundColor': 'rgb(2,108,210)',
			'borderColor': 'rgb(0,0,0)',
			'top': 0,
			'right': 0,
			'height': this.HEIGHT
		});
	},

	/**
	 * Initializes the Button's label (text on the button).
	 * @memberof RelocateButton
	 * @instance
	 */
	initLabel: function() {
		this.data('ui', {
			'text': {
				'font': '12pt Segoe UI Semibold',
				'value': 'Relocate'
			}
		});
	},

	/**
	 * Initializes the Button's event emitter, which emits a client event when the
	 * player clicks the button.
	 * @memberof RelocateButton
	 * @instance
	 */
	initEvents: function() {
		var self = this;

		this.mouseDown(function(event, control) {
			ige.network.send('relocate');
			ige.emit('relocate button clicked');
			control.stopPropagation();
		});
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = RelocateButton;
}
