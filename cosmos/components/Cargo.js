/**
 * Cargo.js
 * 
 * The Cargo class represents a player's entire cargo inventory. 
 * This class provides a high-level interface for managing cargo items.
 *
 *
 * @author Daniel Chiu
 * @class
 * @typedef {Object} Cargo
 * @namespace  
 */
var Cargo = TLEntityComponent.extend({
	classId: 'Cargo',
	componentId: 'cargo',

	_items: undefined,
	_numItems: undefined,
	_numTypes: undefined,
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
		this._numTypes = 0;

		this._recentChanges = {};
	},

	/**
	 * Adds an item type to the cargo.
	 * @param type {string} A string representing the type of item to place in
	 * cargo
	 * @param quantity {number} An integer representing the number of items to
	 * place in cargo. Can be negative, but it is better to use Cargo#remove when
	 * trying to remove items.
	 */
	add: function(type, quantity) {
		quantity = quantity || 1;

		if (!this._items[type]) {
			this._items[type] = 0;
			this._numTypes++;
		}

		this._items[type] += quantity;

		this._numItems += quantity;

		this._recentChanges[type] = this._recentChanges[type] || 0;
		this._recentChanges[type] += quantity;

		this.emit("add", [type, quantity]);
	},

	fromJSON: function(data) {
		this.updateFromChanges(data);
	},

	/**
	 * Retrieves an object which contains the items of the cargo. Object is in the
	 * format quantity = items[type].
	 * @returns {*}
	 */
	items: function() {
		return this._items;
	},

	numItems: function() {
		return this._numItems;
	},

	numItemsOfType: function(type) {
		if (this._items[type]) {
			return this._items[type];
		}
		return 0;
	},

	numTypes: function() {
		return this._numTypes;
	},

	/**
	 * Retrieves the recent changes object. Recent include an aggregation of the
	 * modifications made to the cargo since the last time
	 * Cargo#resetRecentChanges was called.
	 * Reset changes are in the format delta = recentChanges[type].
	 * @returns {*}
	 */
	recentChanges: function() {
		return this._recentChanges;
	},

	/**
	 * Removes items of the specified type from the Cargo.
	 * @param type {string} A string representing the type of item to remove
	 * @param quantity {number} The number of items to remove.
	 * @returns {boolean}
	 */
	remove: function(type, quantity) {
		quantity = quantity || 1;

		if (!this._items[type]) {
			this.log("CargoComponent#remove: tried to remove item type that isn't in cargo: "
				+ type, "warning");
			return false;
		}

		if (this._items[type] < quantity) {
			this.log("CargoComponent#remove: tried to remove " + quantity + " " + type + "'s when"
				+ " only " + this._items[type] + " existed in cargo.", "warning");
			return false;
		}

		this._items[type] -= quantity;
		if (this._items[type] === 0) {
			this._numTypes--;
			delete this._items[type];
		}

		this._numItems -= quantity;

		this._recentChanges[type] = this._recentChanges[type] || 0;
		this._recentChanges[type] -= quantity;

		this.emit("remove", [type, quantity]);

		return true;
	},

	/**
	 * Resets the recent changes object so that there are no recent changes.
	 */
	resetRecentChanges: function() {
		this._recentChanges = {};
	},

	toJSON: function() {
		return this._items;
	},

	/**
	 * Given a changes object in the format delta = changes[type], adds or removes
	 * the necessary items from the cargo to apply the change.
	 * @param changes
	 */
	updateFromChanges: function(changes) {
		var self = this;

		_.forOwn(changes, function(delta, type) {
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

if (typeof (module) !== "undefined" && typeof (module.exports) !== "undefined")
{
	 module.exports = Cargo;
}
