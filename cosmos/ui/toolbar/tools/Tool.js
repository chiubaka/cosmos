/**
 * A tool represents an individual item on a Toolbar that the player can select
 * to modify the way that a capability works.
 *
 * @class
 * @typedef {Object} Tool
 * @namespace 
 */
var Tool = IgeUiElement.extend({
	classId: "Tool",

	/**
	 * The width of the Tool.
	 * @constant {number}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	WIDTH: 64,

	/**
	 * The height of the Tool.
	 * @constant {number}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	HEIGHT: 64,

	// Defines the styling and colors of the tool
	// TODO: Move these into a centralized styles config

	/**
	 * The height of a Tool's bottom border ('stub') on the Toolbar.
	 * @constant {number}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	STUB_HEIGHT: 2,

	/**
	 * The Tool's default stub RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	STUB_COLOR: 'rgb(70, 70, 70)',

	/**
	 * The Tool's default stub RGB color value when the player hovers over 
	 * the Tool.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	HOVER_STUB_COLOR: 'rgb(255, 255, 255)',

	/**
	 * The Tool's default stub RGB color value when the player clicks on 
	 * the Tool.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	ACTIVE_STUB_COLOR: 'rgba(255, 255, 255, 0.5)',

	/**
	 * The Tool's default background RGB color value when the player hovers 
	 * over the Tool.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	HOVER_COLOR: 'rgb(200, 200, 200)',

	/**
	 * The Tool's default background RGB color value when the player clicks
	 * on the Tool.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	ACTIVE_COLOR: 'rgb(100, 100, 100)',

	/**
	 * The Tool's default background RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	BG_COLOR: 'rgb(50, 50, 50)',

	/**
	 * The Tool's default label RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	LABEL_COLOR: 'rgb(255, 255, 255)',

	/**
	 * The Tool's unselected icon image as an IGE texture.
	 * @memberof Tool
	 * @type {Object}
	 * @private
	 * @instance
	 */
	NORMAL_ICON: undefined,

	/**
	 * The Tool's selected icon image as an IGE texture.
	 * @memberof Tool
	 * @type {Object}
	 * @private
	 * @instance
	 */
	ACTIVE_ICON: undefined,

	/**
	 * The name of the Tool and the title used by the attached CapLabel.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	TOOL_NAME: "DefaultTool",

	/**
	 * The default style class for a Tool.
	 * @constant {string}
	 * @default
	 * @memberof Tool
	 * @instance
	 */
	DEFAULT_CLASS: ".toolbar-tool",

	/**
	 * Initializes the Tool's styles, label, associated quantity, and attaches event emitters and listeners.
	 * @memberof Tool
	 * @instance
	 */
	init: function(name, quantity) {
		IgeUiElement.prototype.init.call(this);

		this.log("init with name " + name + "...", 'info');

		this.TOOL_NAME = name;

		// Set up the styling for this tool
		this.initStyles();

		// Set up labels
		this.initLabel();

		// Set up events
		this.initEvents();

		// Set up counter, if necessary
		if (quantity !== undefined && quantity > 1) {
			this.setQuantity(quantity);
		}
	},

	/**
	 * Initializes the Tool's normal, hover, and active styles. Uses IGE's style 
	 * system, which is similar to CSS element selection.
	 * @memberof Tool
	 * @instance
	 */
	initStyles: function() {
		var toolId = this.classId() + "-" + this.TOOL_NAME;
		this.TOOL_ID = toolId;

		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		if (this.NORMAL_ICON === undefined) {
			this.NORMAL_ICON = ige.client.textures.baseCap_color;
			this.ACTIVE_ICON = ige.client.textures.baseCap_white;
		}

		this.ID_NORMAL = toolId;
		this.ID_HOVER = this.ID_NORMAL + ':hover';
		this.ID_SELECTED = this.ID_NORMAL + ':selected';
		this.ID_SELECTED_HOVER = this.ID_NORMAL + ':selected:hover';

		ige.ui.style(this.DEFAULT_CLASS, {
			'width': this.WIDTH,
			'height': this.HEIGHT
		});

		ige.ui.style('#' + this.ID_NORMAL, {
			'borderBottomColor': this.STUB_COLOR,
			'borderBottomWidth': this.STUB_HEIGHT,
			'backgroundImage': this.ACTIVE_ICON,
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

		this.styleClass('toolbar-tool');
		this.id(toolId);
	},

	/**
	 * Initializes the Tool's attached CapLabel and mounts it to the Tool. This is
	 * used for the on-hover label, not for quantities.
	 * @memberof Tool
	 * @instance
	 */
	initLabel: function() {
		this._label = new CapLabel(this.ID_NORMAL, this.TOOL_NAME, this.LABEL_COLOR)
			.mount(this);
	},

	/**
	 * Initializes event listeners for player interaction events and client events
	 * that may trigger a toolbar state change.
	 * @memberof Tool
	 * @instance
	 */
	initEvents: function() {
		var self = this;

		this.on('mouseDown', function() {
			if (!self._selected) {
				self.select();
			} else {
				self.deselect();
				ige.emit('toolbar tool cleared', [this.classId(), this.TOOL_NAME]);
			}
		});

		this._selectEvent = ige.on('toolbar tool selected', function(classId, toolName) {
			if (!self._selected && self.classId() === classId && toolName === self.TOOL_NAME) {
				self.select(true);
			} else if (self.classId() !== classId || toolName !== self.TOOL_NAME) {
				self.deselect();
			}
		});
	},

	/**
	 * Overrides the IgeUiElement destroy method to deregister the tool from receiving tool selection events.
	 * This prevents multiple instances of a single tool ID that might persist across toolbar opening and closing
	 * to respond to the same toolbar selection event and create metrics / behavioral bugs.
	 * @memberof Tool
	 * @instance
	 */
	destroy: function() {
		ige.off('toolbar tool selected', this._selectEvent);
		IgeUiElement.prototype.destroy.call(this);
	},

	/**
	 * Sets the quantity value for the quantity label if the quantity of the tool 
	 * is > 1.
	 * @param quantity {number} the quantity to display
	 * @memberof Tool
	 * @instance
	 */
	setQuantity: function(quantity) {
		this._quantity = new IgeUiLabel()
			.font("12pt Segoe UI Semibold")
			.value(quantity)
			.color("#ffffff")
			.mount(this);

		this._quantity.width(this._quantity._fontEntity.measureTextWidth() + 10).bottom(-5);
	},

	/**
	 * Triggered when the Tool is selected via a player interaction or via another
	 * client event. Upon selection, applies appropriate selection styles, and if
	 * event emission is not suppressed, emits a toolbar selection event.
	 * @param suppress {boolean} Whether or not to suppress the toolbar selection event emission. Set to false or omitted if select is called from a toolbar selection event handler.
	 * @memberof Cap
	 * @instance
	 */
	select: function(suppress) {
		if (suppress === undefined) {
			suppress = false;
		}

		this.log('tool ' + this.TOOL_NAME + ' selected...', 'info');

		// Show the selected state of the button
		this.id(this.ID_SELECTED);
		this.applyStyle(ige.ui.style("#" + this.ID_SELECTED));

		this._selected = true;

		if (!suppress) {
			ige.emit('toolbar tool selected', [this.classId(), this.TOOL_NAME]);
		}
	},

	/**
	 * Triggered when the Tool is deselected via a player interaction or via another
	 * client event. Applies normal styles.
	 * @memberof Tool
	 * @instance
	 */
	deselect: function() {
		if (this._selected) {
			this._selected = false;

			// Show the deselected state of the button
			this.id(this.ID_NORMAL);
			this.applyStyle(ige.ui.style("#" + this.ID_NORMAL));
		}
	},

	/**
	 * Overrides the IgeUiElement _updateStyle method so we can apply hover styles
	 * for the Tool to its attached label.
	 * @memberof Tool
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
	 * Gets the name of this Tool.
	 * @memberof Tool
	 * @instance
	 */
	name: function() {
		return this.TOOL_NAME;
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Tool;
}