var RespawnButton = IgeUiElement.extend({
	classId: "RespawnButton",

	/**
	 * Defines the dimensions of a capability on the Capbar
	 */
	WIDTH: 64,
	HEIGHT: 64,

	init: function() {
		IgeUiElement.prototype.init.call(this);

		this.log('init', 'info');

		// Set up the styling for this capability
		this.initStyles();

		// Set up labels
		//this.initLabel();

		// Set up events
		//this.initEvents();
	},

	initStyles: function() {
		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		this.ID_NORMAL = this.classId();
		this.ID_HOVER = this.classId() + ':hover';
		this.ID_SELECTED = this.classId() + ':selected';
		this.ID_SELECTED_HOVER = this.classId() + ':selected:hover';

		this.applyStyle({
			'backgroundColor': 'rgba(30,30,30,0.7)',
			'borderColor': 'rgba(0,0,0,0)',
			'top': 0,
			'right': 0,
			'height': this.HEIGHT
		});
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

		if (this._toolbar !== undefined) {
			this._toolbar.mount(this.parent());
			this._toolbar._capParent = this;
		}
	},

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
	module.exports = RespawnButton;
}