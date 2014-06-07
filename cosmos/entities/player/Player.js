/**
 * The {@link Player} class represents a player in the game.
 * @typedef {Player}
 * @class
 * @namespace
 */
var Player = BlockGrid.extend({
	classId: 'Player',

	PLAYER_START_DISTANCE: 4000,

	/** The session ID associated with this player's client. */
	_sid: undefined,
	_dbId: undefined,

	/**
	 * Whether or not this {@link Player} is mining. Used to restrict players from mining more than one {@link Block}
	 * at a time.
	 * @memberof Player
	 * @instance
	 */
	mining: false,

	init: function(data) {
		BlockGrid.prototype.init.call(this, data);

		var self = this;

		this.category('player');
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
			this.initClient();
		} else {
			this.initServer();
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
	},

	/**
	 * Getter/setter for the _sid parameter, which stores the session ID of this player.
	 * @param val The new value to use or undefined if we are invoking this function as the getter.
	 * @returns {*} Either the current _sid or this object so that we can chain setter calls.
	 */
	sid: function(val) {
		if (val === undefined) {
			return this._sid;
		}
		this._sid = val;
		return this;
	},

	dbId: function(val) {
		if (val === undefined) {
			return this._dbId;
		}
		this._dbId = val;
		return this;
	},

	/**
	 * Perform client-specific initialization here. Called by init()
	 */
	initClient: function() {
		this.depth(1);
	},

	/**
	 * Perform server-specific initialization here. Called by init()
	 */
	initServer: function() {
		this.cargo = new Cargo();
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function(sectionId, data) {
		// Check if the section is one that we are handling
		if (sectionId === 'score') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._score = data;
			} else {
				// Return current data
				return this._score;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},

	/**
	 * Add the sensor fixture. Called in ServerNetworkEvents after the box2Dbody
	 * is created.
	 * @param {number} radius sets the radius of the attraction field
	 * @return {Player}
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
	 * @param {?number} Strength is a multiplier for attraction force
	 * @return {(number|Player)}
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
	 */
	relocate: function() {
		this.translateTo(
			(Math.random() - .5) * Player.prototype.PLAYER_START_DISTANCE,
			(Math.random() - .5) * Player.prototype.PLAYER_START_DISTANCE,
			0
		);
	},

	/**
	 * Called every time a ship collects a block
	 */
	blockCollectListener: function (player, blockClassId) {
		//TODO: Add a cool animation or sound here, or on another listener
		//console.log("Block collected!");
		player.cargo.addBlock(blockClassId);
	},

	/**
	 * Sends messages to clients to tell them to turn on all of the mining lasers for this player.
	 * @param targetBlock {Block} The {@link Block} that the mining lasers will be focused on.
	 * @memberof Player
	 * @instance
	 * @todo : The fireMiningLasers should be in the Ship class, but it doesn't exist yet.
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
	 * @todo : The turnOffMiningLasers should be in the Ship class, but it doesn't exist yet.
	 */
	turnOffMiningLasers: function(targetBlock) {
		var miningLasers = this.blocksOfType('MiningLaserBlock');
		for (var i = 0; i < miningLasers.length; i++) {
			var miningLaser = miningLasers[i];
			ige.network.send('removeEffect', NetworkUtils.effect('miningLaser', miningLaser, targetBlock));
		}
	},

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

		if (ige.isServer) {
			// This determines how fast you can rotate your spaceship
			// It's some constant times the number of thrusters you have
			var angularImpulse = -3000 * this.numBlocksOfType('ThrusterBlock');

			if (this.controls.key.left) {
				this._box2dBody.ApplyTorque(angularImpulse);
			}
			if (this.controls.key.right) {
				this._box2dBody.ApplyTorque(-angularImpulse);
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

				for (var i = 0; i < engines.length; i++) {
					var engine = engines[i];
					//TODO: Fixtures should have their own position in box2d units. Something like block.fixture().m_shape.m_centroid should work. But this is a little tricky because box2D fixtures don't seem to compute their own world coordinates or rotated offsets. They only store the unrotated offset. Talk with @rafaelCosman if you want help doing this TODO.

					// I'm dividing by 10 because that's the scale factor between IGE and Box2D
					var pointToApplyTo = {x: (this.translate().x() + engine.translate().x()) / 10.0, y: (this.translate().y() - engine.translate().y()) / 10.0};
					pointToApplyTo.x = 2 * this._box2dBody.GetWorldCenter().x - pointToApplyTo.x;
					pointToApplyTo.y = 2 * this._box2dBody.GetWorldCenter().y - pointToApplyTo.y;
					this._box2dBody.ApplyImpulse(impulse, pointToApplyTo);
				}
			}
		}

		BlockGrid.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
