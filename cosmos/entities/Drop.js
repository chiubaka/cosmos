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

	init: function(opts) {
		var self = this;
		// To change owner after initialization, use setOwner()
		this._owner = opts.owner;
		this.category(Drop.BOX2D_CATEGORY);

		if (ige.isServer) {
			this.addComponent(TLPhysicsBodyComponent);
			// Override default bodyDef properties
			this.physicsBody.bodyDef['bodyCategory'] = Drop.BOX2D_CATEGORY;
			this.physicsBody.bodyDef['linkedId'] = opts.owner.id();
		}

		BlockGrid.prototype.init.call(this, opts);

		this.depth(Drop.DEPTH);
		this.height(Block.HEIGHT);
		this.width(Block.WIDTH);

		if (ige.isClient) {
			this.texture(ige.client.textures.drop);
			var effect = NetworkUtils.effect('glow', this.block());
			effect.height = this.block().height();
			effect.width = this.block().width();
			this.block().addEffect(effect);
		}
		else {
			setTimeout(function() {
				if (self.alive()) {
					self.setOwner(undefined);
				}
			}, Drop.OWNERSHIP_PERIOD)
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
			return this.get(new IgePoint2d(0, 0))[0];
		}

		if (this.get(new IgePoint2d(0, 0)).length > 0) {
			this.log("Tried to replace the existing block in a Drop.", "error");
			return;
		}

		this.put(newBlock, new IgePoint2d(0, 0), true);
		return this;
	},

	getOwner: function() {
		return this._owner;
	},

	setOwner: function (newOwner) {
		this._owner = newOwner;
		this.physicsBody.setLinkedId(newOwner);
		return this;
	},

	/**
	 * Checks whether or not the provided {@link IgeEntityBox2d} is the same as this {@link Drop}'s owner.
	 * @param entity {IgeEntityBox2d} The entity to check against this {@link Drop}'s owner.
	 * @returns {boolean} True if the provided entity is the same as this {@link Drop}'s owner. False otherwise.
	 * @memberof Drop
	 * @instance
	 * TODO have this function use the owner() function instead of referenceing _owner
	 */
	isOwner: function(entity) {
		if (this._owner === undefined) {
			return true;
		}

		if (this._owner.classId() === "Player" && entity.classId() === "Player") {
			return this._owner.currentShip() === entity.currentShip();
		}

		return this._owner === entity;
	},

	getAttractedTo: function() {
		return this._attractedTo;
	},

	setAttractedTo: function(newAttraction) {
		this._attractedTo = newAttraction;
		return;
	},

	/**
	 * Overrides the superclass ({@link BlockGrid}) update function. Custom functionality moves this {@link Drop}
	 * towards its attraction target if there is one.
	 * @memberof Drop
	 * @instance
	 */
	update: function(ctx) {
		if (ige.isServer) {
			if (this.getAttractedTo() !== undefined) {
				// If the attractedTo entity is destroyed, remove the reference
				if (ige.$(this.getAttractedTo().id()) === undefined) {
					this.setAttractedTo(undefined);
					return;
				}

				// Attract the block grid to another body. For example, small asteroids
				// are attracted to player ships.
				var attractor = this.getAttractedTo();
				this.physicsBody.attractTo(attractor, attractor.attractionStrength());
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

/**
 * The amount of time in milliseconds that a drop can only be picked up by its owner. After this amount of time, any
 * player may pick up the drop.
 * @constant {number}
 * @default
 * @memberof Drop
 */
Drop.OWNERSHIP_PERIOD = 10000;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Drop; }
