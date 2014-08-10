/**
 * This class represents a ship in Cosmos.
 * A ships is a BlockStructure that also has a cargo. A ship is controlled by a {@link Player} or an AI (not yet implemented).
 */
var Ship = BlockStructure.extend({
	classId: 'Ship',

	/**
	 * Whether or not this {@link Ship} is mining. Used to restrict ships from mining more than one {@link Block}
	 * at a time. I expect that at some later point Ships will be able to mine multiple blocks at once
	 * (assuming the ship has >1 mining lasers). Right now ships can only mine one at a time.
	 * @type {boolean}
	 * @memberof Ship
	 * @instance
	 */
	mining: false,

	/**
	 * The control state of this ship. For example,
	 * {
	 * 	left: false,
	 * 	right: false,
	 * 	up: false,
	 * 	down: false
	 * }
	 * [up and down should potentially be renamed forwards and backwards]
	 * @type {Object}
	 * @memberof Ship
	 * @instance
	 */
	_controls: undefined,

	/**
	* A dictonary that keeps track of the previous state of the controls for this ship.
	* @type {Object}
	* @memberof Ship
	* @instance
	*/
	_prev_controls: undefined,

	/**
	 * The cargo of the ship.
	 * @type {Cargo}
	 * @memberof Ship
	 * @instance
	 */
	cargo: undefined,

	/**
	 * Stores the number of thrusters and engines that you had the last time that update was run
	 * @type {Object}
	 * @memberof Ship
	 * @instance
	 */
	_prevMovementBlocks: undefined,

	/**
	 * A reference to the player that owns this ship.
	 * At some point we may have NPCs, in which case this should be a pointer to the more general object which is the superclass of both Player and NPC.
	 * @type {Player}
	 * @memberof Ship
	 * @instance
	 */
	_player: undefined,

	/**
	 * A list that stores references to all of the engines in this ship
	 * //TODO shouldn't the engines be kept track of by some component? Like a engines component?
	 * @type {Array}
	 * @memberof Ship
	 * @instance
	 */
	_engines: undefined,

	/**
	* A list that stores references to all of the thrusters in this ship
	* //TODO shouldn't the thrusters be kept track of by some component? Like a thrusting component?
	* @type {Array}
	* @memberof Ship
	* @instance
	*/
	_thrusters: undefined,

	init: function(data) {
		// Note that these variables must be initialized before the superclass constructor can be called, because it will add things to them by calling add().
		this._engines = [];
		this._thrusters = [];

		// Set category because BlockGrid superclass will initialize physics body
		this.category(Ship.BOX2D_CATEGORY);

		BlockStructure.prototype.init.call(this, data);

		this._controls = {
			left: false,
			right: false,
			up: false,
			down: false
		};

		if (ige.isClient) {
			this._initClient();
			var player = ige.$(data.playerId);
			if (player) {
				this.player(player);
				this.player().currentShip(this);
			}
		} else {
			this._initServer();
		}

		this._prevMovementBlocks = {
			engines: this._engines.length,
			thrusters: this._thrusters.length
		};

		// Define the data sections that will be included in the stream
		this.streamSections(['transform']);
	},

	streamCreateData: function() {
		var data = BlockStructure.prototype.streamCreateData.call(this);
		if (this.player()) {
			data.playerId = this.player().id();
		}
		return data;
	},

	destroy: function() {
		if (ige.isClient && this.player()) {
			this.player()._destroyUsernameLabel();
		}

		BlockStructure.prototype.destroy.call(this);
	},

	// Getter for the _engines property
	engines: function() {
		return this._engines;
	},

	// Getter for the _thrusters property
	thrusters: function() {
		return this._thrusters;
	},

	/*
	Overrides the superclass's add function
	Updates the engines and thrusters lists on each add
	*/
	add: function(row, col, block, checkForNeighbors) {
		var blockAdded = BlockStructure.prototype.add.call(this, row, col, block, checkForNeighbors);
		if (blockAdded && ige.isServer) {
			DbPlayer.update(this.player().id(), this.player(), function() {});
		}
		if (block instanceof EngineBlock) {
			this.engines().push(block);
		}
		if (block instanceof ThrusterBlock) {
			this.thrusters().push(block);
		}
		return blockAdded;
	},

	streamEntityValid: function(val) {
		if (val !== undefined && this.player() !== undefined) {
			if (val === false) {
				this.player()._destroyUsernameLabel();
			}
			else {
				this.player()._createUsernameLabel();
			}
		}

		return BlockStructure.prototype.streamEntityValid.call(this, val);
	},

	/*
	Overrides the superclass's remove function
	Updates the engines and thrusters lists on each remove
	*/
	remove: function(row, col) {
		var block = this.get(row, col);
		if (block instanceof EngineBlock) {
			this.engines().splice(this.engines().indexOf(block), 1);
		}
		if (block instanceof ThrusterBlock) {
			this.thrusters().splice(this.thrusters().indexOf(block), 1);
		}
		BlockStructure.prototype.remove.call(this, row, col);
		if (ige.isServer) {
			DbPlayer.update(this.player().id(), this.player(), function() {});
		}
	},

	/**
	 * Perform client-specific initialization here. Called by init()
	 * @memberof Ship
	 * @private
	 * @instance
	 */
	_initClient: function() {
		this.depth(Ship.DEPTH);
	},

	/**
	 * Perform server-specific initialization here. Called by init()
	 * @memberof Ship
	 * @private
	 * @instance
	 */
	_initServer: function() {
		this.cargo = new Cargo();

		this
			.addSensor(1000)
			.attractionStrength(0.01)
			.relocate();
	},

	player: function(newPlayer) {
		if (newPlayer === undefined) {
			return this._player;
		}

		this._player = newPlayer;
		if (ige.isClient) {
			this._player._createUsernameLabel();
		}
		return this;
	},

	/**
	 * Add the sensor fixture. Called in ServerNetworkEvents after the box2Dbody
	 * is created.
	 * @param radius {number} The radius of the attraction field
	 * @return {Ship} This object is returned to facilitate setter chaining.
	 * @memberof Ship
	 * @instance
	 */
	addSensor: function(radius) {
		var fixtureDef = {
			fixtureCategory: Ship.BOX2D_ATTRACTOR_CATEGORY,
			friction: 0.0,
			restitution: 0.0,
			density: 0.0,
			isSensor: true,
			shapeType: 'CIRCLE',
			radius: radius,
			x: 0.0,
			y: 0.0
		};

		this.physicsBody.newFixture(this, fixtureDef);

		return this;
	},

	/**
	 * Get/set the strength of attraction
	 * @param strength {number?} A multiplier for attraction force
	 * @return {(number|Ship)} The current attraction strength if no argument is passed or this object if an argument
	 * is passed in order to support setter chaining.
	 * @memberof Ship
	 * @instance
	 */
	attractionStrength: function(strength) {
		if (strength === undefined) {
			return this._attractionStrength;
		}
		else {
			this._attractionStrength = strength;
			return this;
		}
	},

	/**
	 * Changes the ship's location to a random new location.
	 * @memberof Ship
	 * @instance
	 */
	relocate: function() {
		return this.translateTo(
			(Math.random() - .5) * Ship.SHIP_START_RADIUS,
			(Math.random() - .5) * Ship.SHIP_START_RADIUS,
			0
		);
	},

	/**
	 * Checks if the ship is able to mine
	 * @memberof Ship
	 * @instance
	 * @return {Boolean} True if ship can mine
	 */
	canMine: function () {
		// Do not start mining if we are already mining
		if (this.mining) {
			return false;
		}

		// Do not start mining if ship has no mining lasers
		return this.numBlocksOfType(MiningLaserBlock.prototype.classId()) !== 0;
	},

	/**
	 * Sends messages to clients to tell them to turn on all of the mining lasers for this ship.
	 * @param targetBlock {Block} The {@link Block} that the mining lasers will be focused on.
	 * @memberof Ship
	 * @instance
	 */
	fireMiningLasers: function(targetBlock) {
		var miningLasers = this.blocksOfType(MiningLaserBlock.prototype.classId());
		for (var i = 0; i < miningLasers.length; i++) {
			var miningLaser = miningLasers[i];
			ige.network.send('addEffect', NetworkUtils.effect('miningLaser', miningLaser, targetBlock));
		}
	},

	/**
	 * Sends messages to clients to tell them to turn off all of the mining lasers for this ship.
	 * @param targetBlock {Block} The {@link Block} that the mining lasers were focused on.
	 * @memberof Ship
	 * @instance
	 */
	turnOffMiningLasers: function(targetBlock) {
		var miningLasers = this.blocksOfType('MiningLaserBlock');
		for (var i = 0; i < miningLasers.length; i++) {
			var miningLaser = miningLasers[i];
			ige.network.send('removeEffect', NetworkUtils.effect('miningLaser', miningLaser, targetBlock));
		}
	},

	controls: function(newControls) {
		if (newControls === undefined) {
			return this._controls;
		}

		this._controls = newControls;
		return this;
	},

	update: function(ctx) {
		BlockStructure.prototype.update.call(this, ctx);

		if (ige.isServer) {
			/* Angular motion */
			// Angular rotation speed depends on number of thrusters
			if (this.controls().left || this.controls().right) {
				var angularImpulse = 0;
				for (var i = 0; i < this.thrusters().length; i++) {
					angularImpulse += this.thrusters()[i].thrust.value;
				}
				angularImpulse = -angularImpulse * ige._tickDelta;

				if (this.thrusters().length < 1) {
					if (JSON.stringify(this.controls()) !== JSON.stringify(this._prev_controls) ||
						this._prevMovementBlocks.thrusters > 0) {

						ige.network.stream.queueCommand('notificationError',
							NotificationDefinitions.errorKeys.noRotationalThruster, this.player().clientId());
					}
				}
				this._prevMovementBlocks.thrusters = this.thrusters().length;

				if (this.controls().left) {
					this.physicsBody.applyAngularImpulse(angularImpulse);
				}
				if (this.controls().right) {
					this.physicsBody.applyAngularImpulse(-angularImpulse);
				}
			}

			if (this.controls().up || this.controls().down) {
				// Notify player that they cannot fly without an engine
				if (this.engines().length < 1) {
					if (JSON.stringify(this.controls()) !== JSON.stringify(this._prev_controls) ||
						this._prevMovementBlocks.engines > 0) {
						ige.network.stream.queueCommand('notificationError',
							NotificationDefinitions.errorKeys.noEngine, this.player().clientId());
					}
				}
				this._prevMovementBlocks.engines = this.engines().length;

				var linearImpulse = 3 * ige._tickDelta;
				if (this._controls.up) {
					linearImpulse = linearImpulse;
				}
				else if (this._controls.down) {
					linearImpulse = -linearImpulse;
				}

				// The "- Math.PI/2" below makes the ship move forward and backwards,
				// instead of side to side.
				var angle = this._rotate.z - Math.PI/2;

				// Apply impulse at all engine locations
				for (var i = 0; i < this.engines().length; i++) {
					var engine = this.engines()[i];

					var linearImpulse = engine.thrust.value * ige._tickDelta;
					if (this._controls.down) {
						linearImpulse = -linearImpulse;
					}

					var impulseX = Math.cos(angle) * linearImpulse;
					var impulseY = Math.sin(angle) * linearImpulse;

					var enginePosition = this._drawLocationForBlock(engine);

					var opts = {impulseX: impulseX, impulseY: impulseY, posX: 0, posY: 0};
					var opts = {impulseX: impulseX, impulseY: impulseY,
						posX: enginePosition.x, posY: -enginePosition.y};
					this.physicsBody.applyLinearImpulseLocal(opts);

				}
			}

			// Update previous controls so we can tell what has changed each update.
			// We want to send engine missing notifications on a change, not every
			// update
			this._prev_controls = JSON.parse(JSON.stringify(this.controls()));
		}
	},
});

/**
* The radius from the center of the world within which ships will spawn.
* @constant {number}
* @default
* @memberof Ship
*/
Ship.SHIP_START_RADIUS = 4000;

/**
* The Box2D category of all ship entities. Used by Box2D to determine what to do in certain collision scenarios.
* @constant {string}
* @default
* @memberof Ship
*/
Ship.BOX2D_CATEGORY = 'ship';
Ship.ATTRACTOR_BOX2D_CATEGORY = 'attractor';
/**
* The default depth layer for {@link Ship}s when rendered to the screen. Should be rendered above other
* {@link BlockGrid}s.
* @constant {number}
* @default
* @memberof Ship
*/
Ship.DEPTH = 2;

/**
* Called every time a ship collects a block.
* @memberof Ship
* @todo Add a cool animation or sound here, or on another listener
*/
Ship.blockCollectListener = function (ship, blockClassId) {
	ship.cargo.addBlock(blockClassId);
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Ship; }
