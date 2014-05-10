var Tool = IgeUiElement.extend({
	classId: "Tool",

	/**
	 * Defines the dimensions of a capability on the tool
	 */
	WIDTH: 64,
	HEIGHT: 64,

	/**
	 * Defines the styling and colors of the tool
	 */
	// TODO: Move these into a centralized styles config
	STUB_COLOR: 'rgb(70, 70, 70)',
	HOVER_STUB_COLOR: 'rgb(255, 255, 255)',
	ACTIVE_STUB_COLOR: 'rgba(255, 255, 255, 0.5)',
	ACTIVE_COLOR: 'rgb(100, 100, 100)',
	HOVER_COLOR: 'rgb(200, 200, 200)',
	BG_COLOR: 'rgb(50, 50, 50)',
	FG_COLOR: 'rgb(255, 255, 255)',
	INACTIVE_COLOR: 'rgba(0, 0, 0, 0)',
	LABEL_COLOR: 'rgb(255, 255, 255)',
	STUB_HEIGHT: 2,
	STUB_ICON: undefined,
	ACTIVE_ICON: undefined,

	TOOL_NAME: "DefaultTool",
	DEFAULT_CLASS: ".toolbar-tool",

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

	initStyles: function() {
		var toolId = this.classId() + "-" + this.TOOL_NAME;
		this.TOOL_ID = toolId;

		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		if (this.STUB_ICON === undefined) {
			this.STUB_ICON = ige.client.textures.baseCap_color;
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

	initLabel: function() {
		this._label = new CapLabel(this.ID_NORMAL, this.TOOL_NAME, this.LABEL_COLOR)
			.mount(this);
	},

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
				self.select();
			} else if (self.classId() !== classId || toolName !== self.TOOL_NAME) {
				self.deselect();
			}
		});
	},

	destroy: function() {
		ige.off('toolbar tool selected', this._selectEvent, function(removed) { console.log("removed? ", removed);  });
		IgeUiElement.prototype.destroy.call(this);
	},

	setQuantity: function(quantity) {
		this._quantity = new IgeUiLabel()
			.font("12pt Segoe UI Semibold")
			.value(quantity)
			.color("#ffffff")
			.mount(this);

		this._quantity.width(this._quantity._fontEntity.measureTextWidth() + 10).bottom(-5);
	},

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

	deselect: function() {
		if (this._selected) {
			this._selected = false;

			// Show the deselected state of the button
			this.id(this.ID_NORMAL);
			this.applyStyle(ige.ui.style("#" + this.ID_NORMAL));
		}
	},

	_updateStyle: function() {
		IgeUiElement.prototype._updateStyle.call(this);

		if (this._label !== undefined) {
			this._label._mouseStateOver = this._mouseStateOver;
			this._label._updateStyle();
		}
	},

	name: function() {
		return this.CAP_NAME;
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = Tool;
}