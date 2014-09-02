/**
 * Cargo.js
 * 
 * The Cargo class represents a player's entire cargo inventory. 
 * This class provides a high-level interface for managing cargo items.
 * 
 * In the future, other classes can extend the base CargoContainer and CargoItem classes
 * to provide additional functionality reasonably easily.
 *
 * @author Derrick Liu
 * @class
 * @typedef {Object} Cargo
 * @namespace  
 */
var Cargo = TLStreamedEntityComponent.extend({
	classId: 'Cargo',
	componentId: 'cargo',

	_items: undefined,
	_numItems: undefined,
	_recentChanges: undefined,

	/**
	 * Initialize the cargo model for a player.
	 * @memberof Cargo
	 * @instance
	 */
	init: function(entity, options) {
		TLEntityComponent.prototype.init.call(this, entity, options);

		this._items = {};
		this._numItems = 0;

		if (ige.isServer) {
			this._recentChanges = {};
		}
	},

	add: function(type, quantity) {
		quantity = quantity || 1;

		this._items[type] = this._items[type] || 0;
		this._items[type] += quantity;

		this._numItems += quantity;

		this._recentChanges[type] = this._recentChanges[type] || 0;
		this._recentChanges[type] += quantity;

		this.emit('add');
	},

	recentChanges: function() {
		return this._recentChanges;
	},

	remove: function(type, quantity) {
		quantity = quantity || 1;

		if (!this._items[type]) {
			this.log("CargoComponent#remove: tried to remove item type that isn't in cargo: "
				+ type, "error");
		}

		if (this._items[type] < quantity) {
			this.log("CargoComponent#remove: tried to remove " + quantity + " " + type + "'s when"
				+ " only " + this._items[type] + " existed in cargo.", "error");
		}

		this._items[type] -= quantity;
		if (this._items[type] === 0) {
			delete this._items[type];
		}

		this._numItems -= quantity;

		this._recentChanges[type] = this._recentChanges[type] || 0;
		this._recentChanges[type] -= quantity;
	},

	resetRecentChanges: function() {
		this._recentChanges = {};
	},

	updateFromChanges: function(changes) {
		var self = this;

		_.forIn(changes, function(delta, type) {
			// Branch here to avoid awkwardly passing negative numbers to the add function.
			// Additionally, the remove function does some sanity checks.
			if (delta >= 0) {
				self.add(type, delta);
			}
			else {
				self.remove(type, -delta);
			}
		});
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	 module.exports = Cargo;
}
