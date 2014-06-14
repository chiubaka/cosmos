/**
 * @class
 * @typedef {Object} Drop
 * @namespace
 */
var Drop = BlockGrid.extend({
	classId: 'Drop',

	_block: undefined,
	_owner: undefined,

	init: function(data) {
		BlockGrid.prototype.init.call(this, data);
		this.category(Drop.BOX2D_CATEGORY);
	},

	block: function(newBlock) {
		if (newBlock === undefined) {
			return this._block;
		}

		if (this._block !== undefined) {
			console.error("Tried to replace the existing block in a Drop.");
			return;
		}

		this._block = newBlock;
		this.add(0, 0, newBlock);
		return this;
	},

	owner: function(newOwner) {
		if (newOwner === undefined) {
			return this._owner;
		}

		this._owner = newOwner;
		return this;
	}
});

Drop.BOX2D_CATEGORY = 'drop';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Drop; }