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
	controls: undefined,

	/**
	 * The cargo of the ship.
	 * @type {Cargo}
	 * @memberof Ship
	 * @instance
	 */
	cargo: undefined,

	init: function(data) {
		BlockStructure.prototype.init.call(this, data);

		var self = this;//TODO remove this line

		this.category(Ship.BOX2D_CATEGORY);

		this.controls = {
			left: false,
			right: false,
			up: false,
			down: false
		};

		if (ige.isClient) {
			this._initClient();
		} else {
			this._initServer();
		}

		// Define the data sections that will be included in the stream
		//this.streamSections(['transform']);
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
	 * Called every time a ship collects a block.
	 * @memberof Ship
	 * @instance
	 * @todo Make this a static function because it doesn't use instance data
	 * @todo Add a cool animation or sound here, or on another listener
	 */
	blockCollectListener: function (ship, blockClassId) {
		ship.cargo.addBlock(blockClassId);
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
	 * Sends messages to clients to tell them to turn off all of the mining lasers for this ship.
	 * @param targetBlock {Block} The {@link Block} that the mining lasers were focused on.
	 * @memberof Ship
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

	update: function(ctx) {
		BlockStructure.prototype.update.call(this, ctx);

		// TODO: Do not spam the ship with notifications if engines/thruster
		// are removed
		if (ige.isServer) {
			/* Angular motion */
			// Angular rotation speed depends on number of thrusters
			var numRotationalThrusters = this.numBlocksOfType('ThrusterBlock');
			var angularImpulse = -60 * numRotationalThrusters * ige._tickDelta;

			if (this.controls.left || this.controls.right) {
				if (numRotationalThrusters < 1) {
					ige.network.stream.queueCommand('notificationError',
						NotificationDefinitions.errorKeys.noRotationalThruster, this._clientId);
				}

				if (this.controls.left) {
					this._box2dBody.ApplyTorque(angularImpulse);
				}
				if (this.controls.right) {
					this._box2dBody.ApplyTorque(-angularImpulse);
				}
			}

			/* Linear motion */
			if (this.controls.up || this.controls.down) {
				var linearImpulse = 3 * ige._tickDelta;
				if (this.controls.up) {
					linearImpulse = linearImpulse;
				}
				else if (this.controls.down) {
					linearImpulse = -linearImpulse;
				}

				// the "- Math.PI/2" below makes the ship move forward and backwards, instead of side to side.
				var angle = this._box2dBody.GetAngle() - Math.PI/2;

				var x_comp = Math.cos(angle) * linearImpulse;
				var y_comp = Math.sin(angle) * linearImpulse;

				var impulse = new ige.box2d.b2Vec2(x_comp, y_comp);

				var engines = this.blocksOfType(EngineBlock.prototype.classId());

				// Notify ship that they cannot fly without an engine
				if (engines.length < 1) {
					ige.network.stream.queueCommand('notificationError',
						NotificationDefinitions.errorKeys.noEngine, this._clientId);
				}

				for (var i = 0; i < engines.length; i++) {
					var engine = engines[i];
					/*
					TODO: Fixtures should have their own position in box2d units.
					Something like block.fixture().m_shape.m_centroid should work.
					But this is a little tricky because box2D fixtures don't seem to
					compute their own world coordinates or rotated offsets. They only
					store the unrotated offset.
					Talk with @rafaelCosman if you want help doing this TODO.
					*/

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

/**
* The default depth layer for {@link Ship}s when rendered to the screen. Should be rendered above other
* {@link BlockGrid}s.
* @constant {number}
* @default
* @memberof Ship
*/
Ship.DEPTH = 2;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Ship; }
