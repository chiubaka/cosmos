/**
 * This class is the superclass of all blocks, and it contains all of the logic for the blocks.
 * Other blocks just describe the way they are drawn and nothing else.
 */
var Block = IgeEntity.extend({
	classId: 'Block',

	WIDTH: 26,
	HEIGHT: 26,

	// The pixel margin between the drawn health bar and the border of the block
	HEALTH_BAR_MARGIN: 3,
	// The pixel height of the health bar
	HEALTH_BAR_HEIGHT: 4,

	// The time it takes to mine a block in milliseconds
	// TODO: Make this an instance variable and let the value vary for different block types
	MINING_TIME: 100,

	_row: undefined,
	_col: undefined,

	_fixture: undefined,
	_fixtureDef: undefined,

	MAX_HP: 30,
	_hp: undefined,
	_displayHealth: false,

	_busy: false,

	/**
	 * Construct a new block
   * Note that subclasses of Block are expected to have their own textures.
	 * @param data an optional dictionary containing initialization information.
	 */
	init: function (data) {
		IgeEntity.prototype.init.call(this);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(this.WIDTH).height(this.HEIGHT);

		if (data && data.maxHp) {
			this.MAX_HP = data.maxHp;
		}

		this._hp = this.MAX_HP;

		if (!ige.isServer) {
			this.texture(ige.client.textures.block);

			// Enable caching so that the smart textures aren't reevaluated every time.
			this.compositeCache(true);
			this.cacheSmoothing(true);
		}
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

	blockGrid: function() {
		return this._parent._parent;
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
