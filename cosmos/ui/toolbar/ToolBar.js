var Toolbar = IgeUiElement.extend({
	classId: 'Toolbar',

	/**
	 * The height of the toolbar.
	 */
	HEIGHT: 64,
	TOOL_SPACING: 1,
	BG_COLOR: 'rgb(30, 30, 30)',
	BORDER_COLOR: 'rgb(0, 0, 0)',

	PLACEHOLDER_LOADING: "Just a moment...",
	PLACEHOLDER_EMPTY: "Couldn't show anything here.",

	_tools: undefined,
	_placeholderMsg: undefined,
	_capParent: undefined,

	init: function() {
		console.log("Initializing Toolbar...");
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
	},

	mountTools: function() {
		if (this._tools.length == 0) {
			this._placeholderMsg
				.value(this.PLACEHOLDER_EMPTY)
				.width(this._placeholderMsg._fontEntity.measureTextWidth(this.PLACEHOLDER_EMPTY) + 10)
				.mount(this);
			return;
		} else {
			this._placeholderMsg.unMount();
		}

		var numTools = this._tools.length;

		console.log("Number of tools to mount: " + numTools);

		var toolbarWidth = (numTools * this.HEIGHT) + ((numTools - 1) * this.TOOL_SPACING);
		this.width(toolbarWidth);

		for (var i = 0; i < this._tools.length; i++) {
			var tool = this._tools[i];

			var toolCenterOffset = (tool.width() / 2);
			var toolListPosOffset = (i - (numTools / 2)) * (tool.width() + this.TOOL_SPACING);
			var xPos = (toolListPosOffset + toolCenterOffset);

			tool.translateBy(xPos, 0, 0);
			tool.mount(this);
		}

		this.translateTo(this._capParent.translate().x() + (this._capParent.width()) - (this.width() / (numTools)), this.translate().y(), 0);
	}
});