var Toolbar = IgeUiElement.extend({
	classId: 'Toolbar',

	/**
	 * The height of the toolbar.
	 */
	HEIGHT: 64,
	TOOL_SPACING: 0,
	BG_COLOR: 'rgb(30, 30, 30)',
	BORDER_COLOR: 'rgb(0, 0, 0)',

	PLACEHOLDER_LOADING: "Just a moment...",
	PLACEHOLDER_EMPTY: "Couldn't show anything here.",

	_tools: undefined,
	_placeholderMsg: undefined,
	_capParent: undefined,

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

	mount: function(elem) {
		IgeUiElement.prototype.mount.call(this, elem);

		this.bottom(elem.HEIGHT);
		this.mountTools();
	},

	unMount: function() {
		for (var i = 0; i < this._tools.length; i++) {
			var tool = this._tools[i];
			tool.unMount();
		}

		IgeUiElement.prototype.unMount.call(this);
	},

	mountTools: function(needToReselect) {
		if (needToReselect === undefined) {
				needToReselect = false;
		}

		var selectedType = ige.client.state.currentCapability().selectedType;

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

		var numTools = this._tools.length;

		//console.log("Number of tools to mount: " + numTools);

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
				tool.select();
				needToReselect = false;
			} else if (!persistedSelection && selectedType === tool.TOOL_NAME) {
				tool.select();
				persistedSelection = true;
			}
		}

		this.translateTo(this._capParent.translate().x() + (this._capParent.width()) - (this.width() / (numTools)), this.translate().y(), 0);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Toolbar;
}