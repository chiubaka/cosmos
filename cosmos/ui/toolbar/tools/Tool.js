var Tool = IgeUiElement.extend({
	classId: "Tool",

	/**
	 * Defines the dimensions of a capability on the Capbar
	 */
	WIDTH: 64,
	HEIGHT: 64,

	/**
	 * Defines the styling and colors of the capbar
	 */
	// TODO: Move these into a centralized styles config
	STUB_COLOR: "rgb(70, 70, 70)",
	BG_COLOR: "rgb(50, 50, 50)",
	FG_COLOR: "rgb(255, 255, 255)",
	TRANSPARENT: "rgba(0, 0, 0, 0)",
	LABEL_COLOR: "rgb(255, 255, 255)",
	STUB_ICON: undefined,
	ACTIVE_ICON: undefined,

	TOOL_NAME: "DefaultTool",
	DEFAULT_CLASS: ".toolbar-tool",

	init: function(name, quantity) {
		IgeUiElement.prototype.init.call(this);

		console.log("Initializing Tool for " + this.classId() + "-" + name + "...");

		this.TOOL_NAME = name;

		// Set up the styling for this capability
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

			'backgroundColor': this.TRANSPARENT
		});

		ige.ui.style('#' + this.ID_HOVER, {
			'backgroundColor': this.BG_COLOR,
			'borderBottomColor': this.BG_COLOR,
			'backgroundImage': this.ACTIVE_ICON
		});

		ige.ui.style('#' + this.ID_SELECTED_HOVER, {
			'backgroundColor': this.BG_COLOR,
			'borderBottomColor': this.BG_COLOR,
			'backgroundImage': this.ACTIVE_ICON
		});

		ige.ui.style('#' + this.ID_SELECTED, {
			'backgroundColor': this.STUB_COLOR,
			'borderBottomColor': this.STUB_COLOR,
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
				ige.emit('toolbar tool cleared', [self.classId()]);
			}
		});

		ige.on('toolbar tool selected', function(classId) {
			if (!self._selected && classId === self.classId()) {
				self.select();
			} else if (classId !== self.classId()) {
				self.deselect();
			}
		});
	},

	setQuantity: function(quantity) {
		
	},

	select: function() {
		// Show the selected state of the button
		this.id(this.ID_SELECTED);
		this.applyStyle(ige.ui.style("#" + this.ID_SELECTED));

		this._selected = true;
		ige.emit('toolbar tool selected', [this.classId()]);

		if (this._toolbar !== undefined) {
			this._toolbar.mount(this.parent());
		}
	},

	deselect: function() {
		if (this._selected) {
			this._selected = false;

			// Show the deselected state of the button
			this.id(this.ID_NORMAL);
			this.applyStyle(ige.ui.style("#" + this.ID_NORMAL));

			if (this._toolbar !== undefined) {
				this._toolbar.unmount();
			}
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