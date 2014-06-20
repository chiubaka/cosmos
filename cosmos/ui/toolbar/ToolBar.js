/**
 * A Toolbar represents a subpalette of options for a player to choose from when
 * using a capability. For example, choosing different tools on a Toolbar can affect
 * the capability's behavior, use the capability with different input, or 
 * switch between different "flavors" of capability that achieve the same end goal.
 *
 * A Toolbar is mounted to a {@link Cap}, and is hidden and shown by {@link Cap#select} and
 * {@link Cap#deselect}.
 *
 * @class
 * @typedef {Object} Toolbar
 * @namespace 
 */
var Toolbar = IgeUiElement.extend({
	classId: 'Toolbar',

	/**
	 * The height of the Toolbar.
	 * @constant {number}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	HEIGHT: 64,

	/**
	 * The spacing between Tools in the Toolbar.
	 * @constant {number}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	TOOL_SPACING: 0,

	/**
	 * The Toolbar's default RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	BG_COLOR: 'rgb(30, 30, 30)',

	/**
	 * The Toolbar's default border color
	 * @constant {string}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	BORDER_COLOR: 'rgb(0, 0, 0)',

	/**
	 * The message to display when the toolbar is loading after a cap selection event.
	 * @constant {string}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	PLACEHOLDER_LOADING: "Just a moment...",

	/**
	 * The message to display when the toolbar doesn't have any Tools in it.
	 * @constant {string}
	 * @default
	 * @memberof Toolbar
	 * @instance
	 */
	PLACEHOLDER_EMPTY: "Couldn't show anything here.",

	/**
	 * An array that contains the tools that should be hosted by this Toolbar.
	 * @memberof Toolbar
	 * @type {Array}
	 * @instance
	 * @private
	 */
	_tools: undefined,

	/**
	 * The placeholder message label for this toolbar.
	 * @memberof Toolbar
	 * @type {Object}
	 * @instance
	 * @private
	 */
	_placeholderMsg: undefined,

	/**
	 * This Toolbar's parent Cap.
	 * @memberof Toolbar
	 * @type {Object}
	 * @instance
	 * @private
	 */
	_capParent: undefined,

	/**
	 * An event that is called when a refresh occurs.
	 * This is bound and unbound depending on whether the toolbar is visible or not (we don't want to 
	 * waste time refreshing stuff that won't be seen by the player).
	 *
	 * @memberof Toolbar
	 * @type {Object}
	 * @instance
	 * @private
	 */
	_refreshEvent: undefined,

	/**
	 * Initializes the Toolbar's styles and placeholder label.
	 * @memberof Toolbar
	 * @instance
	 */
	init: function() {
		this.log("Initializing...", 'info');
		IgeUiElement.prototype.init.call(this);

		this.applyStyle({
			'backgroundColor': this.BG_COLOR,
			'borderColor': this.BORDER_COLOR,
			'bottom': 0,
			'height': this.HEIGHT
		});

		this.width(200);

		this._placeholderMsg = new IgeUiLabel()
			.font("12pt Segoe UI Semibold")
			.value(this.PLACEHOLDER_LOADING)
			.color("#ffffff")
			.width(180)
			.mount(this);

		this._tools = [];
	},

	/**
	 * Overrides the IgeUiElement mount call to register this toolbar for toolbar
	 * refresh events and mount the hosted tools.
	 * @param elem {Object} the object to mount this Toolbar to
	 * @memberof Toolbar
	 * @instance
	 */
	mount: function(elem) {
		IgeUiElement.prototype.mount.call(this, elem);

		this.bottom(elem.HEIGHT);

		var self = this;
		this._refreshEvent = ige.on('toolbar refresh', function(needToReselect) {
			self.mountTools(needToReselect);
		});

		this.mountTools();
	},

	/**
	 * Overrides the IgeUiElement unmount call to unregister this toolbar from toolbar
	 * refresh events and unmount the hosted tools.
	 * @memberof Toolbar
	 * @instance
	 */
	unMount: function() {
		for (var i = 0; i < this._tools.length; i++) {
			var tool = this._tools[i];
			tool.destroy();
		}

		ige.off('toolbar refresh', this._refreshEvent);

		IgeUiElement.prototype.unMount.call(this);
	},

	/**
	 * Mounts the tools received from the server and positions them appopriately
	 * on the toolbar. If no tools were received, then put up the placeholder empty message.
	 * @param needToReselect {boolean} whether a new tool needs to be automatically selected (e.g. if a previously selected tool is no longer available)
	 * @memberof Toolbar
	 * @instance
	 */
	mountTools: function(needToReselect) {
		if (needToReselect === undefined) {
			needToReselect = false;
		}

		// Put a placeholder message in the toolbar if there aren't any tools to put in it.
		if (this._tools.length == 0) {
			this._placeholderMsg
				.value(this.PLACEHOLDER_EMPTY)
				.width(this._placeholderMsg._fontEntity.measureTextWidth() + 10)
				.mount(this);

			this.width(200);
			return;
		} else {
			this._placeholderMsg.unMount();
		}

		var selectedTool = ige.client.state.currentCapability().selectedType;
		var numTools = this._tools.length;

		this.log("Number of tools to mount: " + numTools, 'info');
		var toolbarWidth = (numTools * this.HEIGHT) + ((numTools - 1) * this.TOOL_SPACING);
		this.width(toolbarWidth);

		var persistedSelection = false;
		for (var i = 0; i < this._tools.length; i++) {
			var tool = this._tools[i];

			var toolCenterOffset = (tool.width() / 2);
			var toolListPosOffset = (i - (numTools / 2)) * (tool.width() + this.TOOL_SPACING);
			var xPos = (toolListPosOffset + toolCenterOffset);

			tool.translateBy(xPos, 0, 0);
			tool.mount(this);

			if (needToReselect) {
				tool.select(false);
				needToReselect = false;
			} else if (!persistedSelection && selectedTool === tool.TOOL_NAME) {
				tool.select(true);
				persistedSelection = true;
			}
		}

		this.translateTo(this._capParent.translate().x() + (this._capParent.width()) - (this.width() / (numTools)), this.translate().y(), 0);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Toolbar;
}