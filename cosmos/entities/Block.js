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

	// #ifdef SERVER
	/**
	 * Queue for block actions that need to be sent to the client.
	 */
	_actions: undefined,
	// #endif

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
		var self = this;
		IgeEntity.prototype.init.call(this);

		data = data || {};

		var isAbstractClass = this.classId() === "Part"
			|| this.classId() === "Armor"
			|| this.classId() === "EngineBlock"
			|| this.classId() === "ThrusterBlock"
			|| this.classId() === "Weapon"
			|| this.classId() === "Laser"
			|| this.classId() === "Resource"
			// TODO: The Element class won't be abstract soon!
			|| this.classId() === "Element"
			|| this.classId() === "DeconstructionIndicator";//TODO this isn't really an abstract class...

		if (data.health) {
			this.addComponent(Health, data.health);
		}
		else if (!isAbstractClass) {
			this.log("No health found for " + this.classId() + ". Health component is mandatory" +
				" for all blocks.", "error");
		}

		if (data.type) {
			this.addComponent(Type, data.type);
		}
		else if (!isAbstractClass) {
			this.log("No type found for " + this.classId() + ". The type component is mandatory" +
				" for all blocks.", "error");
		}

		if (data.description) {
			this.addComponent(Description, data.description);
		}
		else if (!isAbstractClass) {
			this.log("No description found for " + this.classId() + ". The description component " +
				"is mandatory for all blocks.", "error");
		}

		if (data.recipe) {
			this.addComponent(Recipe, data.recipe);
		}

		/* === Grid Data === */
		// Default value for grid height and width is 1.
		var myGridData = {width: 1, height: 1};

		// If a height and width is passed for an element, that height and width will be used.
		if (this.classId() === "Element") {
			myGridData.width = data.gridWidth || myGridData.width;
			myGridData.height = data.gridHeight || myGridData.height;
		}

		// If a height and width is defined in the configuration files for this block, that will
		// be used.
		else if (GridDimensions[this.classId()]) {
			myGridData = GridDimensions[this.classId()];
		}

		this.addComponent(GridData, myGridData);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(Block.WIDTH * this.gridData.width).height(Block.HEIGHT * this.gridData.height);

		this.backgroundAlpha = this.backgroundAlpha || 1;
		if (!this.backgroundColor) {
			this.backgroundAlpha = 0;
		}

		this.borderAlpha = this.borderAlpha || 1;
		if (!this.borderColor) {
			this.borderAlpha = 0;
		}

		this.iconScale = this.iconScale || 1;

		this.addComponent(PixiRenderableComponent, {createDisplayObject: function() {
			var displayObject = new PIXI.DisplayObjectContainer();

			if (self.iconFrame) {
				var icon = PIXI.Sprite.fromFrame(self.iconFrame);

				icon.width = self.width() * self.iconScale;
				icon.height = self.height() * self.iconScale;

				icon.position.x = (self.width() - icon.width) / 2 - Block.WIDTH / 2;
				icon.position.y = (self.height() - icon.height) / 2 - Block.HEIGHT / 2;

				displayObject.addChild(icon);
			}
			else if (self.backgroundColor || self.borderColor) {
				var graphic = new PIXI.Graphics();
				graphic.beginFill(self.backgroundColor, self.backgroundAlpha);
				graphic.lineStyle(Block.BORDER_WIDTH, self.borderColor, self.borderAlpha);
				graphic.drawRect(
						Block.BORDER_WIDTH / 2,
						Block.BORDER_WIDTH / 2,
						self.width() - Block.BORDER_WIDTH,
						self.height() - Block.BORDER_WIDTH
				);
				graphic.endFill();

				graphic.position.x = -self.width() / 2;
				graphic.position.y = -self.height() / 2;

				displayObject.addChild(graphic);
			}

			return displayObject;
		}});

		if (ige.isServer) {
			this.addComponent(TLPhysicsFixtureComponent);
		}
		else {
			this.texture(ige.client.textures.block);

			this._effects = {};

			// Enable caching so that the smart textures aren't reevaluated every time.
			//this.compositeCache(true);
			//this.cacheSmoothing(true);
		}

		if (ige.client) {
			this.mouseOver(function (event, control) {
				if (this.gridData.grid === ige.client.player.currentShip()) {
			    // Stop the event propagating further down the scenegraph
			    control.stopPropagation();

			    // You can ALSO stop propagation without the control object
			    // reference via the global reference:
			    ige.input.stopPropagation();

					this.addEffect({type: 'deconstructionIndicator'});
					//ige.$("deconstructionEntity")
					//	.mount(this);
				}
			});
			this.mouseOut(function (event, control) {
				if (this.gridData.grid === ige.client.player.currentShip()) {
					// You can ALSO stop propagation without the control object
					// reference via the global reference:
					ige.input.stopPropagation();


					this.removeEffect({type: 'deconstructionIndicator'});
					//ige.$("deconstructionEntity")
					//	.unMount(this);
				}
			});
		}
	},

	actions: function(newActions) {
		if (newActions !== undefined) {
			this._actions = newActions;
			return this;
		}

		return this._actions;
	},

	dataFromConfig: function(data, classId) {
		data = data || {};
		classId = classId || this.classId();
		if (Healths[classId] !== undefined) {
			data.health = Healths[classId];
		}

		if (Types[classId] !== undefined) {
			data.type = Types[classId];
		}

		if (Descriptions[classId] !== undefined) {
			data.description = Descriptions[classId];
		}

		if (Recipes[classId] !== undefined) {
			data.recipe = Recipes[classId];
		}

		return data;
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
		// TOOD: Synchronize block ID's between server and client so that we can uniquely identify
		// a block without referring to its block grid, row, and col.
		var data = {
			x: this.mousePosWorld().x,
			y: this.mousePosWorld().y,
			loc: this.gridData.loc,
			blockGridId: this.gridData.grid.id()
		};

		// TODO: Extend when clientState supports multiple current capabilities

		if (ige.client.state !== undefined) {
			ige.client.state.currentCapability().tryPerformAction(this, event, data);
		}
	},

	/**
	 * Called just after this {@link Block} has been placed in a {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @instance
	 */
	onPut: function() {
		if (ige.isClient) {
			this.addEffect({type: 'healthBar'});
		}
	},

	/**
	 * Called just before this {@link Block} is removed from a {@link BlockGrid}. Default is just a stub since the
	 * basic {@link Block} does nothing when removed from a {@link BlockGrid}. Override this function in subclasses of
	 * the {@link Block} if needed.
	 * @memberof BlockGrid
	 * @instance
	 */
	onRemove: function() {
		if (ige.isClient) {
			this.removeEffect({type: 'healthBar'});
		}
	},

	remove: function() {
		if (this.gridData.grid) {
			this.gridData.grid.remove(this.gridData.loc);
		}
	},

	/**
	 * Adds an effect to this {@link Block}. Also takes care of making sure that an effects mount is created for this
	 * {@link Block} if one does not already exist. It is expected that all subclasses call this function at the
	 * beginning of their own addEffect function.
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the laser.
	 * @memberof Block
	 * @instance
	 */
	addEffect: function(effect) {
		switch (effect.type) {
			case 'glow':
				this._addGlowEffect(effect);
				break;
			case 'miningParticles':
				this._addMiningParticles();
				break;
			case 'healthBar':
				this._addHealthBar();
				break;
			case 'deconstructionIndicator':
				this._addDeconstructionIndicator();
				break;
		}
	},

	onDeath: function(player) {
		var loc = this.gridData.loc;
		var grid = this.gridData.grid;

		this.actions().push({
			action: "remove",
			loc: {
				x: loc.x,
				y: loc.y
			}
		});

		// Drop block server side, then send drop msg to client
		grid.drop(player, new IgePoint2d(loc.x, loc.y));
		if (grid.count() === 0) {
			grid.destroy();
		}
	},

	process: function(data) {
		if (data.component) {
			if (this[data.component] === undefined) {
				this.log("Block#process: received data for undefined component: " + data.component,
					"error");
			}

			this[data.component].process(data);
		}
		else {
			this.log("Block#process: received data without component.", "error");
		}
	},

	/**
	 * Removes an effect from this {@link Block}. Also takes care of making sure that the effects mount is destroyed
	 * if there are no more effects on this {@link Block}. It is expected that all subclasses call this function at
	 * the end of their own removeEffect function.
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the laser.
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
			case "deconstructionIndicator":
				this._removeDeconstructionIndicator();
				break;
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

		var effectsCenter = this._effectsCenter();

		this._effects['glow'] = new GlowEffect(effect);
		this._mountEffect(this._effects['glow'], false);
	},

	_effectsAboveContainer: function() {
		return this.gridData.grid.effectsAboveContainer();
	},

	_effectsBelowContainer: function() {
		return this.gridData.grid.effectsBelowContainer();
	},

	_effectsCenter: function() {
		return BlockGrid.coordinatesForBlock(this);
	},

	_mountEffect: function(effect, above) {
		var effectsCenter = this._effectsCenter();

		var container = above ? this._effectsAboveContainer() : this._effectsBelowContainer();

		effect.translateTo(effectsCenter.x, effectsCenter.y, 0).mount(container);
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
		if (!this._effects['miningParticles'].particleEmitter) {
			this._effects['miningParticles'].particleEmitter = new BlockParticleEmitter();
			this._mountEffect(this._effects['miningParticles'].particleEmitter, true);
		}
	},

	_addHealthBar: function() {
		if (this._effects['healthBar'] === undefined) {
			this._effects['healthBar'] = new HealthBar(this);
			this._mountEffect(this._effects['healthBar'], true);
		}
	},

	_addDeconstructionIndicator: function() {
		if (this._effects['deconstructionIndicator'] === undefined) {
			this._effects['deconstructionIndicator'] = new DeconstructionIndicator(this);
			this._mountEffect(this._effects['deconstructionIndicator'], true);
		}

		console.log("Deconstruction indicator added");
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

	_removeDeconstructionIndicator: function() {
		this._effects['deconstructionIndicator'].destroy();
		delete this._effects['deconstructionIndicator'];

		console.log("Deconstruction indicator removed");
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
	blockGrid: function() {
		return this.gridData.grid;
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
	 * Decreases the block's health by the amount passed.
	 * @param amount {number} The amount of health that this {@link Block} should lose.
	 * @memberof Block
	 * @instance
	 */
	takeDamage: function(amount, player) {
		this.health.decrease(amount);

		this.emit('cosmos:block.hp.changed', this.hp());

		if (this.health.value <= 0 && ige.isServer) {
			this.onDeath(player);
		}
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
	},

	toJSON: function() {
		return {
			id: this.id(),
			type: this.classId(),
			gridData: this.gridData.toJSON()
		}
	},

	worldCoordinates: function() {
		if (this.gridData.grid) {
			return this.gridData.grid.worldCoordinatesForBlock(this);
		}

		return null;
	}
});

Block.BORDER_WIDTH = 2;

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
 * How long (in milliseconds) it takes for a ship with a single laser to decrease a block's HP by 1.
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
 * @param type {string} The class ID of the type of {@link Block} we want created.
 * @returns {Block} An instance of the {@link Block} type requested through classId.
 * @memberof Block
 */
Block.fromType = function(type) {
	if (cosmos.blocks.constructors[type] === undefined) {
		return undefined;
	}
	return new cosmos.blocks.constructors[type]();
};

Block.fromJSON = function(json) {
	var block;
	// In this case, we have received information about a block that already exists in the game.
	// Just use that block instead, and make sure to remove it from any grid that it is currently
	// a part of.
	// This currently occurs frequently when blocks are moved from a BlockGrid to a Drop. The Drop
	// will ask for a block that is already in a BlockGrid to be added to itself.
	if (ige.$(json.id) instanceof Block) {
		block = ige.$(json.id);
		block.remove();
	}
	else if (json.type === "Element") {
		block = new Element({
			resource: json.resource,
			purity: json.purity,
			gridWidth: json.gridData.width,
			gridHeight: json.gridData.height
		});
	}
	else {
		block = Block.fromType(json.type);
	}

	block.id(json.id);
	block.gridData.loc = new IgePoint2d(json.gridData.loc.x, json.gridData.loc.y);
	return block;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Block;
}
