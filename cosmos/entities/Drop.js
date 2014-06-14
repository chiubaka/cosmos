/**
 * Subclass of the {@link BlockGrid} class. The Drop class is used to represent a dropped {@link Block} which can be
 * picked up by a player. It understand which player caused it to be dropped in the first place and handles both the
 * physics and appearance of Drops in the game. Also see {@link GameInit#initPhysics}.
 * @class
 * @typedef {Object} Drop
 * @namespace
 */
var Drop = BlockGrid.extend({
	classId: 'Drop',

	/**
	 * The {@link Block} in this {@link Drop}. For now, {@link Drop}s should only ever contain a single {@link Block}
	 * even though {@link Drop}s are backed by a {@link BlockGrid}.
	 * @type {Block}
	 * @memberof Drop
	 * @private
	 * @instance
	 */
	_block: undefined,
	/**
	 * The owner of this {@link Drop}, i.e. the ship that caused the drop to occur. While the owner property is set,
	 * nobody but the owner of the {@link Drop} may pick it up. When the owner property is not set, anybody can pick it
	 * up.
	 * @type {IgeEntityBox2d}
	 * @memberof Drop
	 * @private
	 * @instance
	 */
	_owner: undefined,
	/**
	 * The object that this {@link Drop} is currently moving towards. If not set, this {@link Drop} is not moving.
	 * When an object that can pick up this {@link Drop} gets close to it, the {@link Drop} will accelerate towards it!
	 * @type {IgeEntityBox2d}
	 * @memberof Drop
	 * @private
	 * @instance
	 */
	_attractedTo: undefined,

	shadowBlur: undefined,
	decrementingShadowBlur: undefined,

	init: function(data) {
		BlockGrid.prototype.init.call(this, data);
		this.category(Drop.BOX2D_CATEGORY);

		this.height(Block.HEIGHT);
		this.width(Block.WIDTH);

		if (!ige.isServer) {
			this.shadowBlur = Drop.MAX_SHADOW_BLUR;
			this.decrementingShadowBlur = true;
			this.texture(ige.client.textures.drop);
		}
	},

	/**
	 * Getter/setter for the {@link Drop#_block|_block} property.
	 * @param newBlock {Block?} Optional parameter. If supplied, the new value for the {@link Drop#_block|_block}
	 * property to set. Otherwise, the getter has been called.
	 * @returns {Block|Drop} If the newBlock parameter is not supplied, returns the current {@link Block} in this
	 * {@link Drop}. Otherwise, returns this {@link Drop} to make setter chaining convenient.
	 * @memberof Drop
	 * @instance
	 */
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

	/**
	 * Getter/setter for the {@link Drop#_owner|_owner} property.
	 * @param newOwner {IgeEntityBox2d?} Optional parameter. If supplied, the new value for the
	 * {@link Drop#_owner|_owner} property to set. Otherwise, the getter has been called.
	 * @returns {IgeEntityBox2d|Drop} If the newBlock parameter is not supplied, returns the current owner of this
	 * {@link Drop}. Otherwise, returns this {@link Drop} to make setter chaining convenient.
	 * @memberof Drop
	 * @instance
	 */
	owner: function(newOwner) {
		if (newOwner === undefined) {
			return this._owner;
		}

		this._owner = newOwner;
		return this;
	},

	/**
	 * Checks whether or not the provided {@link IgeEntityBox2d} is the same as this {@link Drop}'s owner.
	 * @param entity {IgeEntityBox2d} The entity to check against this {@link Drop}'s owner.
	 * @returns {boolean} True if the provided entity is the same as this {@link Drop}'s owner. False otherwise.
	 * @memberof Drop
	 * @instance
	 */
	isOwner: function(entity) {
		return this._owner === entity;
	},

	/**
	 * Getter/setter for the {@link Drop#_attractedTo|_attractedTo} property.
	 * @param newAttraction {IgeEntityBox2d?} Optional parameter. If supplied, the new value for the
	 * {@link Drop#_attractedTo|_attractedTo} property to set. Otherwise, the getter has been called.
	 * @returns {IgeEntityBox2d|Drop} If the newBlock parameter is not supplied, returns the current attraction
	 * target of this {@link Drop}. Otherwise, returns this {@link Drop} to make setter chaining convenient.
	 * @memberof Drop
	 * @instance
	 */
	attractedTo: function(newAttraction) {
		if (newAttraction === undefined) {
			return this._attractedTo;
		}

		this._attractedTo = newAttraction;
		return this;
	},

	/**
	 * Overrides the superclass ({@link BlockGrid}) update function. Custom functionality moves this {@link Drop}
	 * towards its attraction target if there is one.
	 * @memberof Drop
	 * @instance
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

/**
 * The Box2D category of all {@link Drop} objects. Used by Box2D to determine what to do in certain collision scenarios.
 * @constant {string}
 * @default
 * @memberof Drop
 */
Drop.BOX2D_CATEGORY = 'drop';

Drop.MAX_SHADOW_BLUR = 75;

Drop.MIN_SHADOW_BLUR = 25;

Drop.SHADOW_BLUR_STEP = 2;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Drop; }