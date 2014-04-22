var Block = IgeEntity.extend({
	classId: 'Block',
	WIDTH: 26,
	HEIGHT: 26,
	_row: undefined,
	_col: undefined,
	_fixture: undefined,
	_fixtureDef:undefined,

	/**
	 * Construct a new block
	 * Note that block doesn't have any texture. This is because subclasses of Block are expected to have their own textures.
	 */
	init: function () {
		this.updateCount = 0;
		IgeEntity.prototype.init.call(this);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(26).height(26);

		this.hp = 10; //this is the default hp of all blocks. Subclasses of block can have a different hp.

		if (!ige.isServer) {
			this.texture(ige.client.textures.block);

			// Enable caching so that the smart textures aren't reevaluated every time.
			this.compositeCache(true);
			this.cacheSmoothing(true);

			this.mouseDown(function(event, control) {
				var data = {
					blockGridId: this.blockGrid().id(),
					row: this._row,
					col: this._col
				};

				ige.network.send('blockClicked', data);

				this.blockGrid().remove(this._row, this._col);
			});
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
		this.hp -= amount;

		if (this.hp <= 0) {
			this.onDeath();
		}
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
			case CarbonBlock.prototype.classId():
				return new CarbonBlock();
			case IceBlock.prototype.classId():
				return new IceBlock();
			case IronBlock.prototype.classId():
				return new IronBlock();
			default:
				return undefined;
		}
	},

	update: function(ctx) {
		if (!ige.isServer) {
			// TODO: This is a fix for having the entity aabb's draw in the center initially rather than where
			// the entity has been initially translated to. Ideally, I should be able to call aabb(true) once
			// before the update loop even happens, but I had trouble finding the right place to do this and even
			// trying to trigger this code on just the first update didn't seem to work.
			this.updateCount++;
			//if (this.updateCount == 10)
				this.aabb(true);
		}

		IgeEntity.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
