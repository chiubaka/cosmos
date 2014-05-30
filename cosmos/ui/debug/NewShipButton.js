var NewShipButton = IgeUiButton.extend({
	classId: "NewShipButton",

	/**
	 * Defines the dimensions of a capability on the Capbar
	 */
	WIDTH: 128,
	HEIGHT: 64,

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
			// The button should show up on the right, underneath the respawn button
			'top': RelocateButton.prototype.HEIGHT,
			'right': 0,
			'height': this.HEIGHT
		});
	},

	initLabel: function() {
		this.data('ui', {
			'text': {
				'font': '12pt Segoe UI Semibold',
				'value': 'New Ship'
			}
		});
	},

	initEvents: function() {
		var self = this;

		this.mouseDown(function(event, control) {
			ige.network.send('new ship');
			ige.emit('new ship button clicked');
		});
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = NewShipButton;
}
