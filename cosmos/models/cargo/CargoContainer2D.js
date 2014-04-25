var CargoContainer2D = CargoContainer.extend({
	classId: 'CargoContainer2D',

	_width: 1,
	_height: 1,

	init: function(width, height) {
		if (width <= 0 || height <= 0) {
			throw "Dimensions must be positive!";
		}

		this._itemStore = [];
		this._width = width;
		this._height = height;
		this._capacity = width * height;

		for (var m = 0; m < width; m++) {
			this._itemStore[m] = [];
			for (var n = 0; n < height; n++) {
				this._itemStore[m][n] = undefined;
			}
		}
	},

	addItem: function(item) {
		
	},

	getItems: function(itemId) {
		throw "Not implemented";
	},

	capacity: function() {
		return this._capacity;
	},

	numItems: function() {
		return this._numItems;
	},

	hasSpace: function() {
		return (this._capacity - this._numItems > 0);
	}
});
