var Cap = IgeUiElement.extend({
	classId: "Cap",

	/**
	 * Defines the dimensions of a capability on the Capbar
	 */
	WIDTH: 64,
	HEIGHT: 64,
	STUB_HEIGHT: 10,

	/**
	 * Defines the styling and colors of the capbar
	 */
	// TODO: Move these into a centralized styles config
	DEFAULT_CLASS: '.capbar-cap',
	STUB_COLOR: "rgb(70, 70, 70)",
	BG_COLOR: "rgb(50, 50, 50)",
	FG_COLOR: "rgb(255, 255, 255)",
	TRANSPARENT: "rgba(0, 0, 0, 0)",
	STUB_ICON: undefined,
	ACTIVE_ICON: undefined,

	/**
	 * Define the name of the capability and the title used by the Label
	 */
	CAP_NAME: "Default",
	_label: undefined,
	LABEL_COLOR: "rgb(255, 255, 255)",
	LABEL_WIDTH: 100,

	_selected: false,

	init: function() {
		IgeUiElement.prototype.init.call(this);

		console.log("Initializing Capbar entry for " + this.classId() + "...");

		// Set up the styling for this capability
		this.initStyles();

		// Set up labels
		this.initLabel();

		// Set up events
		this.initEvents();
	},

	initStyles: function() {
		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		if (this.STUB_ICON === undefined) {
			this.STUB_ICON = ige.client.textures.baseCap_color;
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
			'backgroundImage': this.STUB_ICON,
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

		this.styleClass('capbar-cap');
		this.id(this.classId());
	},

	initLabel: function() {
		this._label = new CapLabel(this.classId(), this.CAP_NAME, this.LABEL_COLOR)
			.mount(this);
	},

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

	select: function() {
		// Show the selected state of the button
		this.id(this.ID_SELECTED);
		this.applyStyle(ige.ui.style("#" + this.ID_SELECTED));

		this._selected = true;
		ige.emit('capbar cap selected', [this.classId()]);
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