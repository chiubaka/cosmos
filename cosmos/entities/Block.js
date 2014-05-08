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
	MINING_TIME: 2000,

	_row: undefined,
	_col: undefined,

	_fixture: undefined,
	_fixtureDef: undefined,

	_maxHp: 10,
	_hp: undefined,
	_displayHealth: false,

	_busy: false,

	/**
	 * Construct a new block
	 * Note that block doesn't have any texture. This is because subclasses of Block are expected to have their own textures.
	 */
	init: function () {
		IgeEntity.prototype.init.call(this);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(this.WIDTH).height(this.HEIGHT);

		this._hp = this._maxHp;

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

		this._displayHealth = true;

		self.decrementHealthIntervalId = setInterval(function() {
			if (self._hp > 0) {
				self._hp--;
				self.cacheDirty(true);
			}
			if (self._hp == 0) {
				clearInterval(self.decrementHealthIntervalId)
			}
		}, self.MINING_TIME / self._maxHp);

		ige.network.send('blockClicked', data);
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
		this.hp -= amount;

		if (this.hp <= 0) {
			this.onDeath();
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

	/**
	onDeath will be called when the block reaches 0 or less hp
	Objects that contain blocks should set the onDeath function to be something more useful.
	For example, the blockGrid class should set the block's onDeath function to break off from the grid.
	*/
	onDeath: function() {},

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
