/**
 * CargoContainer2D.js
 * @author Derrick Liu
 * 
 * WIP: A 2D extension of a CargoContainer that represents a physical cargo block and its dimensions
 * on a player's ship.
 * 
 * This is an example of how CargoContainers can be extended. Many methods have not been implemented yet.
 */
var CargoContainer2D = CargoContainer.extend({
	classId: 'CargoContainer2D',

	_width: 1,
	_height: 1,
	_block: undefined,

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

	linkItem: function(item) {
		return CargoContainer.prototype.linkItem.call(this, item);
	},

	unlinkItem: function(itemId) {
		return CargoContainer.prototype.unlinkItem.call(this, itemId);
	},

	hasItem: function(itemId) {
		return CargoContainer.prototype.hasItem.call(this, itemId);
	},

	getItem: function(itemId) {
		return CargoContainer.prototype.getItem.call(this, itemId);
	},

	hasSpace: function() {
		return CargoContainer.prototype.hasSpace.call(this);
	}
});
