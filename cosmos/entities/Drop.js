/**
 * @class
 * @typedef {Object} Drop
 * @namespace
 */
var Drop = BlockGrid.extend({
	classId: 'Drop',

	_block: undefined,
	_owner: undefined,
	_attractedTo: undefined,

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
	},

	isOwner: function(entity) {
		return this._owner === entity;
	},

	attractedTo: function(newAttraction) {
		if (newAttraction === undefined) {
			return this._attractedTo;
		}

		this._attractedTo = newAttraction;
		return this;
	},

	/**
	 * Is update called once per time-step per viewport, or just once per time-step?
	 */
	update: function(ctx) {
		if (ige.isServer) {

			// Attract the block grid to another body. For example, small asteroids
			// are attracted to player ships.
			if (this.attractedTo() !== undefined) {
				var attractedToBody = this.attractedTo()._box2dBody;
				var thisBody = this._box2dBody;
				var impulse = new ige.box2d.b2Vec2(0, 0);
				impulse.Add(attractedToBody.GetWorldCenter());
				impulse.Subtract(thisBody.GetWorldCenter());
				impulse.Multiply(this.attractedTo().attractionStrength());
				thisBody.ApplyImpulse(impulse, thisBody.GetWorldCenter());
			}


			//This is just a little bit larger than the background image. That's why I chose this size.
			var MAX_X = 7000;
			var MAX_Y = 7000;
			var x = this.translate().x();
			var y = this.translate().y();

			if (x > MAX_X || x < -MAX_X) {
				this.translateTo(-x, y, 0);
			}
			if (y > MAX_Y || y < -MAX_Y) {
				this.translateTo(x, -y, 0);
			}
		}

		BlockGrid.prototype.update.call(this, ctx);
	}
});

Drop.BOX2D_CATEGORY = 'drop';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Drop; }