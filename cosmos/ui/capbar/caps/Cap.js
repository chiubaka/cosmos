/**
 * A Cap represents a Cap that the player can interface with to interface
 * with the game environment, similar to a tool in a tool palette. The CapBar can
 * host multiple Caps, all of different types.
 *
 * @class
 * @typedef {Object} Cap
 * @namespace  
 */
var Cap = IgeUiElement.extend({
	classId: "Cap",

	/**
	 * The width of a Cap on the Capbar.
	 * @constant {number}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	WIDTH: 64,

	/**
	 * The height of a Cap on the Capbar.
	 * @constant {number}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	HEIGHT: 64,

	/**
	 * The height of a Cap's bottom border ('stub') on the Capbar.
	 * @constant {number}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	STUB_HEIGHT: 10,

	// Define Cap styles and icons
	// TODO: Move these into a centralized styles config

	/**
	 * The default style class for a Cap.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	DEFAULT_CLASS: '.capbar-cap',

	/**
	 * The Cap's default stub RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	STUB_COLOR: 'rgb(70, 70, 70)',

	/**
	 * The Cap's default stub RGB color value when the player hovers over 
	 * the Cap.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	HOVER_STUB_COLOR: 'rgb(255, 255, 255)',

	/**
	 * The Cap's default stub RGB color value when the player clicks on 
	 * the Cap.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	ACTIVE_STUB_COLOR: 'rgba(255, 255, 255, 0.5)',

	/**
	 * The Cap's default background RGB color value when the player hovers 
	 * over the Cap.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	HOVER_COLOR: 'rgb(200, 200, 200)',

	/**
	 * The Cap's default background RGB color value when the player clicks
	 * on the Cap.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	ACTIVE_COLOR: 'rgb(100, 100, 100)',

	/**
	 * The Cap's default background RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	BG_COLOR: 'rgba(0, 0, 0, 0)',

	/**
	 * The Cap's default label RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	LABEL_COLOR: "rgb(255, 255, 255)",

	/**
	 * The Cap's unselected icon image as an IGE texture.
	 * @memberof Cap
	 * @type {Object}
	 * @private
	 * @instance
	 */
	NORMAL_ICON: undefined,

	/**
	 * The Cap's selected icon image as an IGE texture.
	 * @memberof Cap
	 * @type {Object}
	 * @private
	 * @instance
	 */
	ACTIVE_ICON: undefined,

	// Names and Labels

	/**
	 * The name of the Cap and the title used by the attached CapLabel.
	 * @constant {string}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	CAP_NAME: "Default",

	/**
	 * The attached CapLabel instance
	 * @memberof Cap
	 * @type {Object}
	 * @private
	 * @instance
	 */
	_label: undefined,

	/**
	 * The width of the attached CapLabel's text field
	 * @constant {number}
	 * @default
	 * @memberof Cap
	 * @instance
	 */
	LABEL_WIDTH: 100,

	/**
	 * Whether this Cap is selected or not.
	 * @type {boolean}
	 * @private
	 * @instance
	 */
	_selected: false,

	/**
	 * Contains this Cap's associated Toolbar, if one exists.
	 * @type {Object}
	 * @private
	 * @instance
	 */
	_toolbar: undefined,

	/**
	 * Initializes the Cap's styles, label, and attaches event emitters and listeners.
	 * @memberof Cap
	 * @instance
	 */
	init: function() {
		IgeUiElement.prototype.init.call(this);

		this.log('init', 'info');

		// Set up the styling for this Cap
		this.initStyles();

		// Set up labels
		this.initLabel();

		// Set up events
		this.initEvents();
	},

	/**
	 * Initializes the Cap's normal, hover, and active styles. Uses IGE's style 
	 * system, which is similar to CSS element selection.
	 * @memberof Cap
	 * @instance
	 */
	initStyles: function() {
		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		if (this.NORMAL_ICON === undefined) {
			this.NORMAL_ICON = ige.client.textures.baseCap_color;
			this.ACTIVE_ICON = ige.client.textures.baseCap_white;
		}

		this.ID_NORMAL = this.classId();
		this.ID_HOVER = this.classId() + ':hover';
		this.ID_SELECTED = this.classId() + ':selected';
		this.ID_SELECTED_HOVER = this.classId() + ':selected:hover';

		ige.ui.style(this.DEFAULT_CLASS, {
			'width': this.WIDTH,
			'height': this.HEIGHT
		});

		ige.ui.style('#' + this.ID_NORMAL, {
			'borderBottomColor': this.STUB_COLOR,
			'borderBottomWidth': this.STUB_HEIGHT,
			'backgroundImage': this.NORMAL_ICON,
			'backgroundSize': [this.WIDTH, this.HEIGHT],

			'backgroundColor': this.BG_COLOR
		});

		ige.ui.style('#' + this.ID_HOVER, {
			'backgroundColor': this.HOVER_COLOR,
			'borderBottomColor': this.HOVER_STUB_COLOR,
			'backgroundImage': this.ACTIVE_ICON
		});

		ige.ui.style('#' + this.ID_SELECTED_HOVER, {
			'backgroundColor': this.HOVER_COLOR,
			'borderBottomColor': this.HOVER_STUB_COLOR,
			'backgroundImage': this.ACTIVE_ICON
		});

		ige.ui.style('#' + this.ID_SELECTED, {
			'backgroundColor': this.ACTIVE_COLOR,
			'borderBottomColor': this.ACTIVE_STUB_COLOR,
			'backgroundImage': this.ACTIVE_ICON
		});

		this.styleClass('capbar-cap');
		this.id(this.classId());
	},

	/**
	 * Initializes the Cap's attached CapLabel and mounts it to the Cap.
	 * @memberof Cap
	 * @instance
	 */
	initLabel: function() {
		this._label = new CapLabel(this.classId(), this.CAP_NAME, this.LABEL_COLOR)
			.mount(this);
	},

	/**
	 * Initializes event listeners for player interaction events and client events
	 * that may trigger a capbar state change.
	 * @memberof Cap
	 * @instance
	 */
	initEvents: function() {
		var self = this;

		this.on('mouseDown', function() {
			if (!self._selected) {
				self.select();
			} else {
				self.deselect();
				ige.emit('capbar cap cleared', [self.classId()]);
			}
		});

		ige.on('capbar cap selected', function(classId)
		{
			if (!self._selected && classId === self.classId()) {
				self.select();
			} else if(classId !== self.classId()) {
				self.deselect();
			}
		});
	},

	/**
	 * Triggered when the Cap is selected via a player interaction or via another
	 * client event. Applies appropriate selection styles, mounts and shows an attached
	 * toolbar, if one is defined for this Cap.
	 * @memberof Cap
	 * @instance
	 */
	select: function() {
		// Show the selected state of the button
		this.id(this.ID_SELECTED);
		this.applyStyle(ige.ui.style("#" + this.ID_SELECTED));

		this._selected = true;
		ige.emit('capbar cap selected', [this.classId()]);

		if (this._toolbar !== undefined) {
			this._toolbar.mount(this.parent());
			this._toolbar._capParent = this;
		}
	},

	/**
	 * Triggered when the Cap is deselected via a player interaction or via another
	 * client event. Applies normal styles, hides and unmounts an attached
	 * toolbar, if one is defined for this Cap.
	 * @memberof Cap
	 * @instance
	 */
	deselect: function() {
		if (this._selected) {
			this._selected = false;

			// Show the deselected state of the button
			this.id(this.ID_NORMAL);
			this.applyStyle(ige.ui.style("#" + this.ID_NORMAL));

			if (this._toolbar !== undefined) {
				this._toolbar.unMount();
			}
		}
	},

	/**
	 * Overrides the IgeUiElement _updateStyle method so we can apply hover styles
	 * for the cap to its attached label.
	 * @memberof Cap
	 * @private
	 * @instance
	 */
	_updateStyle: function() {
		IgeUiElement.prototype._updateStyle.call(this);

		if (this._label !== undefined) {
			this._label._mouseStateOver = this._mouseStateOver;
			this._label._updateStyle();
		}
	},

	/**
	 * Gets the name of this Cap.
	 * @memberof Cap
	 * @instance
	 */
	name: function() {
		return this.CAP_NAME;
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Cap;
}