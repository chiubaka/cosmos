/**
 * This class is the superclass of all blocks, and it contains all of the basic logic for the blocks. The
 * Block class is abstract, so should not be instantiated. Subclasses of the Block extend functionality and
 * override abstract methods.
 *
 * @class
 * @typedef {Object} Block
 * @namespace
 */
var Block = IgeEntity.extend({
	classId: 'Block',

	/**
	 * The maximum health value for this {@link Block}. This is a constant to make it clear that the value should not,
	 * in general, be changed (the one exception being in the init function for a {@link Block}). It is an instance
	 * variable because we still want to take advantage of inheritance on this property.
	 * @constant {number}
	 * @memberof Block
	 * @instance
	 */
	MAX_HP: 30,

	/**
	 * The number of rows that this {@link Block} takes up.
	 * @type {number}
	 * @memberof Block
	 * @private
	 * @instance
	 * @todo Add code allow the {@link Block#_numRows|_numRows} to vary.
	 */
	_numRows: 1,
	/**
	 * The number of cols that this {@link Block} takes up.
	 * @type {number}
	 * @memberof Block
	 * @private
	 * @instance
	 * @todo Add code allow the {@link Block#_numCols|_numCols} to vary.
	 */
	_numCols: 1,
	/**
	 * The {@link BlockGrid} that this {@link Block} is a part of.
	 * @type {BlockGrid}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_blockGrid: undefined,
	/**
	 * The row of the {@link BlockGrid} that this block inhabits if any.
	 * The value of this instance variable is meaningless unless _blockGrid is defined.
	 * @type {number}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_row: undefined,
	/**
	 * The column of the {@link BlockGrid} that this block inhabits if any.
	 * The value of this instance variable is meaningless unless _blockGrid is defined.
	 * @type {number}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_col: undefined,
	/**
	 * An IgeEntity that all of the foreground effects for this {@link Block} get mounted to.
	 * @type {IgeEntity}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_effectsMountAbove: undefined,
	/**
	 * An IgeEntity that all of the background effects for this {@link Block} get mounted to.
	 * @type {IgeEntity}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_effectsMountBelow: undefined,
	/**
	 * An object used as a map to store data about the various effects on a {@link Block}. The map keys are the effect
	 * types, and the values are typically objects. Each value can be specific to the effect, since different effects
	 * have different state needs.
	 * @type {Object}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_effects: undefined,
	/**
	 * The Box2D fixture associated with this {@link Block}. Only valid if this {@link Block}'s
	 * {@link Block#_blockGrid|_blockGrid} property is set.
	 * @type {Object}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_fixture: undefined,
	/**
	 * The Box2D fixture definition associated with this {@link Block}. Only valid if this {@link Block}'s
	 * {@link Block#_blockGrid|_blockGrid} property is set.
	 * @type {Object}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_fixtureDef: undefined,
	/**
	 * An entity associated with this {@link Block} which is used to visualize a {@link BlockGrid}'s fixtures. Only
	 * used if this {@link Block} is in a {@link BlockGrid} that has debugFixtures set to true.
	 * @type {Object}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_fixtureDebuggingEntity: undefined,
	/**
	 * A flag that determines whether or not this {@link Block} is currently being mined or not. The default value is
	 * false, and when the value is false this {@link Block} is not currently being mined.
	 * @type {boolean}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_isBeingMined: false,

	/**
	 * Construct a new block
	 * Note that subclasses of Block are expected to have their own textures.
	 * @param data {Object} an optional dictionary containing initialization information.
	 * @memberof Block
	 * @instance
	 */
	init: function(data) {
		IgeEntity.prototype.init.call(this);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(Block.WIDTH).height(Block.HEIGHT);

		if (data && data.MAX_HP) {
			this.MAX_HP = data.MAX_HP;
		}

		this.addComponent(Health, {max: this.MAX_HP});

		// Check if a recipe has been provided for this block. If so, this block is craftable. Otherwise, it is not.
		if (Recipes[this.classId()] !== undefined)
		{
			this.addComponent(Recipe, Recipes[this.classId()]);
		}

		// Check if a description has been provided for this block. If so, this block is describable. Otherwise, it is not.
		if (Descriptions[this.classId()] !== undefined)
		{
			this.addComponent(Description, Descriptions[this.classId()]);
		}

		if (!ige.isServer) {
			this.texture(ige.client.textures.block);

			this._effects = {};

			// Enable caching so that the smart textures aren't reevaluated every time.
			this.compositeCache(true);
			this.cacheSmoothing(true);
		}
	},

	displayName: function() {
		var tokens = this.classId().match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
		var displayName = "";
		for (var i = 0; i < tokens.length - 1; i++) {
			var token = tokens[i];
			displayName += token + " ";
		}
		return displayName;
	},

	/**
	 * Getter for {@link Block#_numRows|_numRows}.
	 * @returns {number}
	 * @memberof Block
	 * @instance
	 */
	numRows: function() {
		return this._numRows;
	},

	/**
	 * Getter for {@link Block#_numCols|_numCols}.
	 * @returns {number}
	 * @memberof Block
	 * @instance
	 */
	numCols: function() {
		return this._numCols;
	},

	hp: function() {
		return this.health.value;
	},

	/**
	 * Processes actions that must occur when a {@link Block} is clicked.
	 * @param event {Object} Object containing information about the event that was fired. DO NOT TRUST THIS. This is
	 * currently sent down from the {@link BlockGrid} and the values in the event are not changed so that they are
	 * with respect to the {@link Block}.
	 * @param control {Object} The control object associated with the event that was fired.
	 * @memberof Block
	 * @instance
	 */
	mouseDown: function(event, control) {
		var self = this;
		var data = {
			blockGridId: this.blockGrid().id(),
			row: this._row,
			col: this._col
		};

		// TODO: Expand when clientState supports multiple current capabilities
		if (ige.isClient && ige.client !== undefined && ige.client.state !== undefined) {
			ige.client.state.currentCapability().tryPerformAction(self, event, data);
		}
	},

	/**
	 * Called just after this {@link Block} has been added to a {@link BlockGrid}. Default is just a stub since the
	 * basic {@link Block} does nothing when added to a {@link BlockGrid}. Override this function in subclasses of
	 * the {@link Block} to do things like add effects to all {@link Block}s of a certain type.
	 * @memberof BlockGrid
	 * @instance
	 */
	onAdded: function() {

	},

	/**
	 * Called just before this {@link Block} is removed from a {@link BlockGrid}. Default is just a stub since the
	 * basic {@link Block} does nothing when removed from a {@link BlockGrid}. Override this function in subclasses of
	 * the {@link Block} if needed.
	 * @memberof BlockGrid
	 * @instance
	 */
	onRemoved: function() {

	},

	/**
	 * Creates the above effects mount entity for this {@link Block} and stores it in an instance variable. If the
	 * effects mount has already been created for this {@link Block}, this function does nothing.
	 * @memberof BlockGrid
	 * @instance
	 */
	createAboveEffectsMount: function() {
		if (this._effectsMountAbove !== undefined) {
			return;
		}

		this._effectsMountAbove = new IgeEntity().depth(this.depth() + 1);
	},

	/**
	 * Creates the above effects mount entity for this {@link Block} and stores it in an instance variable. If the
	 * effects mount has already been created for this {@link Block}, this function does nothing.
	 * @memberof BlockGrid
	 * @instance
	 */
	createBelowEffectsMount: function() {
		if (this._effectsMountBelow !== undefined) {
			return;
		}

		this._effectsMountBelow = new IgeEntity().depth(this.depth() - 1);
	},

	/**
	 * Getter for the {@link Block#_effectsMountAbove|_effectsMountAbove} property.
	 * @returns {IgeEntity} the above effects mount
	 * @memberof Block
	 * @instance
	 */
	effectsMountAbove: function() {
		return this._effectsMountAbove;
	},

	/**
	 * Getter for the {@link Block#_effectsMountBelow|_effectsMountBelow} property.
	 * @returns {IgeEntity} the below effects mount
	 * @memberof Block
	 * @instance
	 */
	effectsMountBelow: function() {
		return this._effectsMountBelow;
	},

	/**
	 * Adds an effect to this {@link Block}. Also takes care of making sure that an effects mount is created for this
	 * {@link Block} if one does not already exist. It is expected that all subclasses call this function at the
	 * beginning of their own addEffect function.
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the mining laser.
	 * @memberof Block
	 * @instance
	 */
	addEffect: function(effect) {
		if (this._effectsMountAbove === undefined) {
			this.blockGrid().createAboveEffectsMount(this);
		}
		if (this._effectsMountBelow === undefined) {
			this.blockGrid().createBelowEffectsMount(this);
		}

		switch (effect.type) {
			case 'glow':
				this._addGlowEffect(effect);
				break;
			case 'miningParticles':
				this._addMiningParticles();
				break;
			case 'healthBar':
				this._addHealthBar();
		}
	},

	/**
	 * Removes an effect from this {@link Block}. Also takes care of making sure that the effects mount is destroyed
	 * if there are no more effects on this {@link Block}. It is expected that all subclasses call this function at
	 * the end of their own removeEffect function.
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the mining laser.
	 * @memberof Block
	 * @instance
	 */
	removeEffect: function(effect) {
		switch (effect.type) {
			case 'glow':
				this._removeGlowEffect();
				break;
			case 'miningParticles':
				this._removeMiningParticles();
				break;
			case 'healthBar':
				this._removeHealthBar();
				break;
		}

		if (!this._hasEffects()) {
			if (this._effectsMountAbove !== undefined) {
				this._effectsMountAbove.destroy();
			}
			if (this._effectsMountBelow !== undefined) {
				this._effectsMountBelow.destroy();
			}
		}
	},

	/**
	 * Checks whether or not this {@link Block} has any effects. It is imperative that all effects code clean up after
	 * itself by deleting its key from the {@link Block#_effects|_effects} map when no longer needed, since this code
	 * checks how many keys are in that map.
	 * @returns {boolean}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_hasEffects: function() {
		return Object.keys(this._effects).length === 0;
	},

	/**
	 * Adds a glow effect to this {@link Block}.
	 * @param effect {Object} An effect object that has all of the information about a {@link GlowEffect} object.
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_addGlowEffect: function(effect) {
		if (this._effects['glow'] !== undefined) {
			this._effects['glow'].destroy();
		}

		this._effects['glow'] = new GlowEffect(effect)
			.depth(this.depth() - 1)
			.mount(this._effectsMountBelow);
	},

	/**
	 * Removes the glow effect from this {@link Block}.
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_removeGlowEffect: function() {
		if (this._effects['glow'] !== undefined) {
			this._effects['glow'].destroy();
			delete this._effects['glow'];
		}
	},

	/**
	 * Adds the mining particles effect to this {@link Block}. At some point, multiple ships will be able to mine a
	 * {@link Block} at once, so the mining particles effects state includes a counter so we know when we should really
	 * remove this effect.
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_addMiningParticles: function() {
		if (this._effects['miningParticles'] === undefined) {
			this._effects['miningParticles'] = {
				counter: 0,
				particleEmitter: undefined
			};
		}

		this._effects['miningParticles'].counter++;
		this._effects['miningParticles'].particleEmitter = new BlockParticleEmitter().mount(this._effectsMountAbove);
	},

	_addHealthBar: function() {
		if (this._effects['healthBar'] === undefined) {
			this._effects['healthBar'] = new HealthBar(this)
				.mount(this._effectsMountAbove);
		}

	},

	/**
	 * Removes mining particles effect from this {@link Block}. If there are multiple people mining this {@link Block},
	 * then the counter in the mining particles effect state may not go down to zero during this call, in which case
	 * we will not actually remove the mining particles effect (because somebody else is still mining!).
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_removeMiningParticles: function() {
		this._effects['miningParticles'].counter--;

		if (this._effects['miningParticles'].counter === 0) {
			this._effects['miningParticles'].particleEmitter.destroy();
			delete this._effects['miningParticles'];
		}
	},

	/**
	 * Removes the health bar from block. This is not usually called because when
	 * the block (and any effects) are destroyed when the hp is 0.
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_removeHealthBar: function() {
		this._effects['healthBar'].destroy();
		delete this._effects['healthBar'];
	},

	/**
	 * Getter/setter for the {@link Block#_blockGrid|_blockGrid} parameter. MUST be set! Many things depend on this.
	 * @param newBlockGrid {BlockGrid} Optional parameter. The new {@link BlockGrid} to associate with this
	 * {@link Block}.
	 * @returns {*} The current {@link BlockGrid} associated with this {@link Block} if the getter is called, or this
	 * object if the setter is called to make setter chaining convenient.
	 * @memberof Block
	 * @instance
	 */
	blockGrid: function(newBlockGrid) {
		if (newBlockGrid === undefined) {
			return this._blockGrid;
		}

		this._blockGrid = newBlockGrid;
		return this;
	},

	/**
	 * Getter/setter for the {@link Block#_row|_row} property.
	 * @param val {number} Optional parameter. If set, this is the new row value for this {@link Block}.
	 * @returns {*} The current row if no parameter is passed or this object if a parameter is passed to make setter
	 * chaining convenient.
	 * @memberof Block
	 * @instance
	 */
	row: function(val) {
		if (val !== undefined) {
			this._row = val;
			return this;
		}
		return this._row;
	},

	/**
	 * Getter/setter for the {@link Block#_col|_col} property.
	 * @param val {number} Optional parameter. If set, this is the new col value for this {@link Block}.
	 * @returns {*} The current col if no parameter is passed or this object if a parameter is passed to make setter
	 * chaining convenient.
	 * @memberof Block
	 * @instance
	 */
	col: function(val) {
		if (val !== undefined) {
			this._col = val;
			return this;
		}
		return this._col;
	},

	/**
	 * Getter/setter for the {@link Block#_fixture|_fixture} property.
	 * @param newFixture {number} Optional parameter. If set, this is the new fixture for this {@link Block}.
	 * @returns {*} The current fixture if no parameter is passed or this object if a parameter is passed to make setter
	 * chaining convenient.
	 * @memberof Block
	 * @instance
	 */
	fixture: function(newFixture) {
		if (newFixture !== undefined) {
			this._fixture = newFixture;
			return this;
		}
		return this._fixture;
	},

	/**
	 * Getter/setter for the {@link Block#_fixtureDef|_fixtureDef} property.
	 * @param newFixtureDef {number} Optional parameter. If set, this is the new fixture for this {@link Block}.
	 * @returns {*} The current fixture definition if no parameter is passed or this object if a parameter is passed to
	 * make setter chaining convenient.
	 * @memberof Block
	 * @instance
	 */
	fixtureDef: function(newFixtureDef) {
		if (newFixtureDef !== undefined) {
			this._fixtureDef = newFixtureDef;
			return this;
		}
		return this._fixtureDef;
	},

	/**
	 * Getter/setter for the {@link Block#_fixtureDebuggingEntity|_fixtureDebuggingEntity} property.
	 * @param fixtureDebuggingEntity {FixtureDebuggingEntity} Optional parameter. If provided, this is the new
	 * {@link FixtureDebuggingEntity} for this {@link Block}.
	 * @returns {*} The existing {@link FixtureDebuggingEntity} if no argument is provided, or this object if an
	 * argument is provided in order to make function call chaining convenient.
	 * @memberof Block
	 * @instance
	 */
	fixtureDebuggingEntity: function(fixtureDebuggingEntity) {
		if (fixtureDebuggingEntity !== undefined) {
			this._fixtureDebuggingEntity = fixtureDebuggingEntity;
			return this;
		}
		return this._fixtureDebuggingEntity;
	},

	/**
	 * Decreases the block's health by the amount passed.
	 * @param amount {number} The amount of health that this {@link Block} should lose.
	 * @memberof Block
	 * @instance
	 */
	takeDamage: function(amount) {
		this.health.decrease(amount);

		if (!ige.isServer) {
			if (this._healthBar === undefined) {
				this.addEffect({type: 'healthBar'});
			}
		}

		this.emit('cosmos:block.hp.changed', this.hp());
	},

	/**
	 * Getter/setter for the {@link Block#_isBeingMined|_isBeingMined} property. This flag is set to true on the server
	 * when mining begins. Currently, this is done so that blocks can't be mined by two players and get doubly removed
	 * from the {@link BlockGrid}.
	 * @param bool {boolean}
	 * @return {*}
	 * @memberof Block
	 * @instance
	 */
	isBeingMined: function(bool) {
		if (bool !== undefined) {
			this._isBeingMined = bool;
			return this;
		}
		return this._isBeingMined;
	}
});

/**
 * Constant for the width of a {@link Block} as drawn in the world.
 * @constant {number}
 * @memberof Block
 */
Block.WIDTH = 26;
/**
 * Constant for the height of a {@link Block} as drawn in the world.
 * @constant {number}
 * @memberof Block
 */
Block.HEIGHT = 26;
/**
 * How long (in milliseconds) it takes for a ship with a single mining laser to decrease a block's HP by 1.
 * Note that even though MINING_INTERVAL is the same for all blocks,
 * blocks take different amounts of time to completely mine because they have different amounts of HP.
 * @constant {number}
 * @memberof Block
 */
Block.MINING_INTERVAL = 100;
/**
 * The amount of spacing between a {@link Block}'s health bar and the sides of the {@link Block} when the {@link Block}
 * is rendered. This value is measured in pixels.
 * @constant {number}
 * @memberof Block
 */
Block.HEALTH_BAR_MARGIN = 3;
/**
 * The height of the displayed health bar for a {@link Block}. This value is measured in pixels.
 * @constant {number}
 * @memberof Block
 */
Block.HEALTH_BAR_HEIGHT = 4;

Block.displayNameFromClassId = function(classId) {
	var tokens = classId.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
	var displayName = "";
	for (var i = 0; i < tokens.length - 1; i++) {
		var token = tokens[i];
		if (i != 0) {
			displayName += " ";
		}
		displayName += token;
	}
	return displayName;
};

/**
 * Given a class ID, returns a new instance of the {@link Block} type associated with that class ID.
 * @param classId {string} The class ID of the type of {@link Block} we want created.
 * @returns {Block} An instance of the {@link Block} type requested through classId.
 * @memberof Block
 */
Block.blockFromClassId = function(classId) {
	switch (classId) {
		case Block.prototype.classId():
			return new Block();

		//Ship parts
		case CargoBlock.prototype.classId():
			return new CargoBlock();
		case ControlBlock.prototype.classId():
			return new ControlBlock();
		case EngineBlock.prototype.classId():
			return new EngineBlock();
		case FuelBlock.prototype.classId():
			return new FuelBlock();
		case MiningLaserBlock.prototype.classId():
			return new MiningLaserBlock();
		case PowerBlock.prototype.classId():
			return new PowerBlock();
		case ThrusterBlock.prototype.classId():
			return new ThrusterBlock();

		// Armor
		case HullBlock.prototype.classId():
			return new HullBlock();
		case CloakBlock.prototype.classId():
			return new CloakBlock();
		case CloakBlockLight.prototype.classId():
			return new CloakBlockLight();
		case CloakBlockViolet.prototype.classId():
			return new CloakBlockViolet();
		case CloakBlockVioletLight.prototype.classId():
			return new CloakBlockVioletLight();
		case KryptoniteBlock.prototype.classId():
			return new KryptoniteBlock();
		case MithrilBlock.prototype.classId():
			return new MithrilBlock();
		case AdamantiumBlock.prototype.classId():
			return new AdamantiumBlock();
		case DragonBlock.prototype.classId():
			return new DragonBlock();
		case TitaniumBlock.prototype.classId():
			return new TitaniumBlock();
		case VioletBlock.prototype.classId():
			return new VioletBlock();
		case OrangeBlock.prototype.classId():
			return new OrangeBlock();

		// Elements
		case CarbonBlock.prototype.classId():
			return new CarbonBlock();
		case IceBlock.prototype.classId():
			return new IceBlock();
		case IronBlock.prototype.classId():
			return new IronBlock();
		case GoldBlock.prototype.classId():
			return new GoldBlock();
		case FluorineBlock.prototype.classId():
			return new FluorineBlock();
		case CobaltBlock.prototype.classId():
			return new CobaltBlock();

		default:
			return undefined;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
