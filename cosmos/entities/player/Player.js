/**
 * An {@link IgeEntity} that represents a player in the game.
 * The player class contains all of the additional data and functionality (beyond a mere block grid) that is needed to
 * represent a player in Cosmos.
 * @typedef {Player}
 * @class
 * @namespace
 * @todo This design should be replaced by something more natural (like there should be a ship class) and/or
 * something component-based.
 */
var Player = BlockStructure.extend({
	classId: 'Player',

	/**
	 * The session ID associated with this player's client and current session.
	 * @type {string}
	 * @memberof Player
	 * @private
	 * @instance
	 */
	_sid: undefined,
	/**
	 * The ID for this {@link Player} object in the database. Used for loading and storing data associated with a
	 * particular {@link Player}.
	 * @type {string}
	 * @memberof Player
	 * @private
	 * @instance
	 */
	_dbId: undefined,

	/**
	 * Whether or not this {@link Player} is mining. Used to restrict players from mining more than one {@link Block}
	 * at a time.
	 * @type {boolean}
	 * @memberof Player
	 * @instance
	 */
	mining: false,

	/**
	 * The clientId associated with the player. Used to send notifications to
	 * a specific player.
	 * @type {string}
	 * @memberof Player
	 * @private
	 * @instance
	 */
	 _clientId: undefined,

	init: function(data) {
		BlockStructure.prototype.init.call(this, data);

		var self = this;

		this.category(Player.BOX2D_CATEGORY);
		this._attractionStrength = 1;

		this.controls = {
			key: {
				left: false,
				right: false,
				up: false,
				down: false
			}
		};

		if (ige.isClient) {
			this._initClient();
		} else {
			this._initServer();
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
	},

	/**
	 * Getter/setter for the _sid parameter, which stores the session ID of this player.
	 * @param val {string?} The new value to use or undefined if we are invoking this function as the getter.
	 * @returns {string|Player} Either the current _sid or this object so that we can chain setter calls.
	 * @memberof Player
	 * @instance
	 */
	sid: function(val) {
		if (val === undefined) {
			return this._sid;
		}
		this._sid = val;
		return this;
	},

	/**
	 * Getter/setter for the dbId parameter, which stores the database ID of this player.
	 * @param val {string?} The new value to use or undefined if we are invoking this function as the getter.
	 * @returns {string|Player} Either the current database ID or this object so that we can chain setter calls.
	 * @memberof Player
	 * @instance
	 */
	dbId: function(val) {
		if (val === undefined) {
			return this._dbId;
		}
		this._dbId = val;
		return this;
	},

	/**
	 * Getter/setter for the _clientId parameter. This is set when the player
	 * is created and read when a notification is sent to a specific
	 * player.
	 * @param val {string?} The new value to use or undefined if we are invoking this function as the getter.
	 * @returns {string|Player} Either the clientId or this object so that we can chain setter calls.
	 * @memberof Player
	 * @instance
	 */
	clientId: function(val) {
		if (val === undefined) {
			return this._clientId;
		}
		this._clientId = val;
		return this;
	},


	/**
	 * Perform client-specific initialization here. Called by init()
	 * @memberof Player
	 * @private
	 * @instance
	 */
	_initClient: function() {
		this.depth(Player.DEPTH);
	},

	/**
	 * Perform server-specific initialization here. Called by init()
	 * @memberof Player
	 * @private
	 * @instance
	 */
	_initServer: function() {
		this.cargo = new Cargo();
	},

	/**
	 * Add the sensor fixture. Called in ServerNetworkEvents after the box2Dbody
	 * is created.
	 * @param radius {number} The radius of the attraction field
	 * @return {Player} This object is returned to facilitate setter chaining.
	 * @memberof Player
	 * @instance
	 */
	addSensor: function(radius) {
		// Create the fixture
		var fixtureDef = {
			density: 0.0,
			friction: 0.0,
			restitution: 0.0,
			isSensor: true,
			shape: {
				type: 'circle',
				data: {
					radius: radius,
					x: 0,
					y: 0
				}
			}
		};

		var tempFixture = ige.box2d.createFixture(fixtureDef);
		var tempShape = new ige.box2d.b2CircleShape();

		tempShape.SetRadius(fixtureDef.shape.data.radius / ige.box2d._scaleRatio);
		tempShape.SetLocalPosition(new ige.box2d.b2Vec2(fixtureDef.shape.data.x /
			ige.box2d._scaleRatio, fixtureDef.shape.data.y / ige.box2d._scaleRatio));

		tempFixture.shape = tempShape;

		this._box2dBody.CreateFixture(tempFixture);

		return this;
	},

	/**
	 * Get/set the strength of attraction
	 * @param strength {number?} A multiplier for attraction force
	 * @return {(number|Player)} The current attraction strength if no argument is passed or this object if an argument
	 * is passed in order to support setter chaining.
	 * @memberof Player
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
	 * Changes the player's location to a random new location.
	 * @memberof Player
	 * @instance
	 */
	relocate: function() {
		this.translateTo(
			(Math.random() - .5) * Player.PLAYER_START_RADIUS,
			(Math.random() - .5) * Player.PLAYER_START_RADIUS,
			0
		);
	},

	/**
	 * Called every time a ship collects a block.
	 * @memberof Player
	 * @instance
	 * @todo Make this a static function because it doesn't use instance data
	 * @todo Add a cool animation or sound here, or on another listener
	 */
	blockCollectListener: function (player, blockClassId) {
		player.cargo.addBlock(blockClassId);
	},

	/**
	 * Checks if the player is able to mine
	 * @memberof Player
	 * @instance
	 * @return {Boolean} True if player can mine
	 */
	 canMine: function () {
		// Do not start mining if we are already mining
		if (this.mining) {
			return false;
		}

		// Do not start mining if player has no mining lasers
		if (this.numBlocksOfType(MiningLaserBlock.prototype.classId()) === 0) {
			ige.network.stream.queueCommand('notificationError',
				NotificationDefinitions.errorKeys.noMiningLaser, clientId);
			return false;
		}
		return true;
	 },

	/**
	 * Sends messages to clients to tell them to turn on all of the mining lasers for this player.
	 * @param targetBlock {Block} The {@link Block} that the mining lasers will be focused on.
	 * @memberof Player
	 * @instance
	 * @todo The fireMiningLasers should be in the Ship class, but it doesn't exist yet.
	 */
	fireMiningLasers: function(targetBlock) {
		var miningLasers = this.blocksOfType(MiningLaserBlock.prototype.classId());
		for (var i = 0; i < miningLasers.length; i++) {
			var miningLaser = miningLasers[i];
			ige.network.send('addEffect', NetworkUtils.effect('miningLaser', miningLaser, targetBlock));
		}
	},

	/**
	 * Sends messages to clients to tell them to turn off all of the mining lasers for this player.
	 * @param targetBlock {Block} The {@link Block} that the mining lasers were focused on.
	 * @memberof Player
	 * @instance
	 * @todo The turnOffMiningLasers should be in the Ship class, but it doesn't exist yet.
	 */
	turnOffMiningLasers: function(targetBlock) {
		var miningLasers = this.blocksOfType('MiningLaserBlock');
		for (var i = 0; i < miningLasers.length; i++) {
			var miningLaser = miningLasers[i];
			ige.network.send('removeEffect', NetworkUtils.effect('miningLaser', miningLaser, targetBlock));
		}
	},

	/**
	 * Override the {@link IgeEntity#update} function to provide support for player controls and {@link Block} functions
	 * like applying force where {@link EngineBlock}s are or turning faster when there are more {@link ThrusterBlock}s.
	 * @param ctx {Object} The render context.
	 * @memberof Player
	 * @instance
	 */
	update: function(ctx) {
		if (!ige.isServer) {
			/* Save the old control state for comparison later */
			oldControls = JSON.stringify(this.controls);

			/* Modify the KEYBOARD controls to reflect which keys the client currently is pushing */
			this.controls.key.up =
				ige.input.actionState('key.up') | ige.input.actionState('key.up_W');
			this.controls.key.down =
				ige.input.actionState('key.down') | ige.input.actionState('key.down_S');
			this.controls.key.left =
				ige.input.actionState('key.left') | ige.input.actionState('key.left_A');
			this.controls.key.right =
				ige.input.actionState('key.right') | ige.input.actionState('key.right_D');

			if (JSON.stringify(this.controls) !== oldControls) { //this.controls !== oldControls) {
				// Tell the server about our control change
				ige.network.send('playerControlUpdate', this.controls);
			}
		}

		// TODO: Do not spam the player with notifications if engines/thruster
		// are removed
		if (ige.isServer) {
			/* Angular motion */
			// Angular rotation speed depends on number of thrusters
			var numRotationalThrusters = this.numBlocksOfType('ThrusterBlock');
			var angularImpulse = -3000 * numRotationalThrusters;

			if (this.controls.key.left || this.controls.key.right) {
				if (numRotationalThrusters < 1) {
					ige.network.stream.queueCommand('notificationError',
						NotificationDefinitions.errorKeys.noRotationalThruster, this._clientId);
				}

				if (this.controls.key.left) {
					this._box2dBody.ApplyTorque(angularImpulse);
				}
				if (this.controls.key.right) {
					this._box2dBody.ApplyTorque(-angularImpulse);
				}
			}

			/* Linear motion */
			if (this.controls.key.up || this.controls.key.down) {
				var linearImpulse;
				if (this.controls.key.up) {
					linearImpulse = 100;
				}
				else if (this.controls.key.down) {
					linearImpulse = -100;
				}

				// the "- Math.PI/2" below makes the ship move forward and backwards, instead of side to side.
				var angle = this._box2dBody.GetAngle() - Math.PI/2;

				var x_comp = Math.cos(angle) * linearImpulse;
				var y_comp = Math.sin(angle) * linearImpulse;

				var impulse = new ige.box2d.b2Vec2(x_comp, y_comp);

				var engines = this.blocksOfType(EngineBlock.prototype.classId());

				// Notify player that they cannot fly without an engine
				if (engines.length < 1) {
					ige.network.stream.queueCommand('notificationError',
						NotificationDefinitions.errorKeys.noEngine, this._clientId);
				}

				for (var i = 0; i < engines.length; i++) {
					var engine = engines[i];
					// TODO: Fixtures should have their own position in box2d units.
					// Something like block.fixture().m_shape.m_centroid should work.
					// But this is a little tricky because box2D fixtures don't seem to
					// compute their own world coordinates or rotated offsets. They only
					// store the unrotated offset.
					// Talk with @rafaelCosman if you want help doing this TODO.

					var scaleRatio = ige.box2d.scaleRatio();
					var thisX = this.translate().x();
					var thisY = this.translate().y();
					var engineX = engine.translate().x();
					var engineY = engine.translate().y();

					var pointToApplyTo = {x: (thisX + engineX) / scaleRatio, y: (thisY - engineY) / scaleRatio};
					pointToApplyTo.x = 2 * this._box2dBody.GetWorldCenter().x - pointToApplyTo.x;
					pointToApplyTo.y = 2 * this._box2dBody.GetWorldCenter().y - pointToApplyTo.y;
					this._box2dBody.ApplyImpulse(impulse, pointToApplyTo);
				}
			}
		}

		BlockGrid.prototype.update.call(this, ctx);
	}
});

/**
 * The radius from the center of the world within which players will spawn.
 * @constant {number}
 * @default
 * @memberof Player
 */
Player.PLAYER_START_RADIUS = 4000;

/**
 * The Box2D category of all player entities. Used by Box2D to determine what to do in certain collision scenarios.
 * @constant {string}
 * @default
 * @memberof Player
 */
Player.BOX2D_CATEGORY = 'player';

/**
 * The default depth layer for {@link Player}s when rendered to the screen. Should be rendered above other
 * {@link BlockGrid}s.
 * @constant {number}
 * @default
 * @memberof Player
 */
Player.DEPTH = 2;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
