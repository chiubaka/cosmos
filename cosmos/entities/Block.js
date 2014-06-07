/**
 * This class is the superclass of all blocks, and it contains all of the logic for the blocks.
 * Other blocks just describe the way they are drawn and nothing else.
 *
 * @class
 * @typedef {Object} Block
 * @namespace
 */
var Block = IgeEntity.extend({
	classId: 'Block',

	// The pixel margin between the drawn health bar and the border of the block
	HEALTH_BAR_MARGIN: 3,
	// The pixel height of the health bar
	HEALTH_BAR_HEIGHT: 4,

	// The time it takes to mine a block in milliseconds
	// TODO: Make this an instance variable and let the value vary for different block types
	MINING_TIME: 100,

	_row: undefined,
	_col: undefined,

	/**
	 * The number of rows that this {@link Block} takes up.
	 * @memberof Block
	 * @private
	 * @instance
	 * @todo Add code allow the {@link Block#_numRows|_numRows} to vary.
	 */
	_numRows: 1,
	/**
	 * The number of cols that this {@link Block} takes up.
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
	 * An IgeEntity that all of the effects for this {@link Block} get mounted to.
	 * @type {IgeEntity}
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_effectsMount: undefined,
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

	_fixture: undefined,
	_fixtureDef: undefined,
	/**
	 * An entity associated with this {@link Block} which is used to visualize a {@link BlockGrid}'s fixtures. Only
	 * used if this {@link Block} is in a {@link BlockGrid} that has debugFixtures set to true.
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_fixtureDebuggingEntity: undefined,

	MAX_HP: 30,
	_hp: undefined,
	_displayHealth: false,

	_busy: false,

	/**
	 * Construct a new block
	 * Note that subclasses of Block are expected to have their own textures.
	 * @param data an optional dictionary containing initialization information.
	 */
	init: function(data) {
		IgeEntity.prototype.init.call(this);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(Block.WIDTH).height(Block.HEIGHT);

		if (data && data.MAX_HP) {
			this.MAX_HP = data.MAX_HP;
		}

		this._hp = this.MAX_HP;

		if (!ige.isServer) {
			this.texture(ige.client.textures.block);

			this._effects = {};

			// Enable caching so that the smart textures aren't reevaluated every time.
			this.compositeCache(true);
			this.cacheSmoothing(true);
		}
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
	 * Creates the effects mount entity for this {@link Block} and stores it in an instance variable. If the
	 * effects mount has already been created for this {@link Block}, this function does nothing.
	 * @memberof BlockGrid
	 * @instance
	 */
	createEffectsMount: function() {
		if (this._effectsMount !== undefined) {
			return;
		}

		this._effectsMount = new IgeEntity().depth(BlockGrid.EFFECTS_DEPTH);
	},

	/**
	 * Getter for the {@link Block#_effectsMount|_effectsMount} property.
	 * @returns {IgeEntity}
	 * @memberof Block
	 * @instance
	 */
	effectsMount: function() {
		return this._effectsMount;
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
		if (this._effectsMount === undefined) {
			this.blockGrid().createEffectsMount(this);
		}

		switch (effect.type) {
			case 'miningParticles':
				this._addMiningParticles();
				break;
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
			case 'miningParticles':
				this._removeMiningParticles();
				break;
		}

		if (!this._hasEffects() && this._effectsMount !== undefined) {
			this._effectsMount.destroy();
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
		this._effects['miningParticles'].particleEmitter = new BlockParticleEmitter().mount(this._effectsMount);
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
			delete this._effects['miningParticls'];
		}
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

	row: function(val) {
		if (val !== undefined) {
			this._row = val;
			return this;
		}
		return this._row;
	},

	col: function(val) {
		if (val !== undefined) {
			this._col = val;
			return this;
		}
		return this._col;
	},

	fixture: function(my_fixture) {
		if (my_fixture !== undefined) {
			this._fixture = my_fixture;
			return this;
		}
		return this._fixture;
	},

	fixtureDef: function(my_fixtureDef) {
		if (my_fixtureDef !== undefined) {
			this._fixtureDef = my_fixtureDef;
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
	 * After health is decreased, the block may die.
	 */
	damage: function(amount) {
		this._hp -= amount;

		if (!ige.isServer) {
			this._displayHealth = true;
			this.cacheDirty(true);
		}
	},

	/**
	 * Block is set to busy on the server when mining begins.
	 * This is so blocks can't be mined by two players and get
	 * doubly removed from the BlockGrid.
	 * @param {boolean=}
	 * @return {*}
	 */
	busy: function(bool) {
		if (bool !== undefined) {
			this._busy = bool;
			return this;
		}
		return this._busy;
	},

	blockFromClassId: function(classId) {
		switch (classId) {
			case Block.prototype.classId():
				return new Block();
			//ship parts
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
			//now the elements
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
