/**
 * The player class contains all of the additional data and functionality (beyond a mere block grid) that is needed to represent a player in Cosmos.
 * TODO this design should be replaced by something more natural (like there should be a ship class) and/or something component-based.
 */
var Player = BlockGrid.extend({
	classId: 'Player',
	_dbId: undefined,

	init: function(data) {
		BlockGrid.prototype.init.call(this, data);

		var self = this;

		this.category('player');
		this._attractionStrength = 1;

		this.drawBounds(false);

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
		// TODO: Add engine particles dynamically as engine blocks are added
		this.addEngineParticles();
	},

	/**
	 * Perform server-specific initialization here. Called by init()
	 */
	initServer: function() {
		this.cargo = new Cargo();
	},

	// Created on server, streamed to all clients
	addLaser: function(blockGridId, row, col) {
		// Hack because we can't mount on mining laser block
		// (Server has no blocks mounted)
		if(this.laserMount === undefined) {
			this.laserMount = new EffectsMount()
				.mount(this)
				.streamMode(1)
				// TODO: Vary the position depending on where mining laser is,
				// or implement server streaming of blocks.
				// Right now, we translate the laser mount to the location of the mining
				// laser block.
				.translateBy(0, -115, 0)
		}

		this.laserBeam = new LaserBeam()
			.setTarget(blockGridId, row, col)
			.streamMode(1)
			.mount(this.laserMount);

		return this;
	},

	addEngineParticles: function() {
		var player = this;
		this.laserParticleEmitter = new IgeParticleEmitter()
			// Set the particle entity to generate for each particle
			.particle(EngineParticle)
			// Set particle life to 300ms
			.lifeBase(300)
			// Set output to 60 particles a second (1000ms)
			.quantityBase(60)
			.quantityTimespan(1000)
			// Set the particle's death opacity to zero so it fades out as it's lifespan runs out
			.deathOpacityBase(0)
			// Set velocity vector to y = 0.05, with variance values
			//.velocityVector(new IgePoint3d(0, 0.05, 0), new IgePoint3d(-0.04, 0.05, 0), new IgePoint3d(0.04, 0.15, 0))
			.translateVarianceY(-10, 10)
			.translateVarianceX(-10, 10)
			// Mount new particles to the object scene
			.particleMountTarget(ige.client.spaceGameScene)
			// Move the particle emitter to the bottom of the ship
			.translateTo(0, 100, 0)
			.mount(player)
			// Mount the emitter to the ship
			.start();
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
		}
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
	 * Called every time a ship mines a block
	 */
	blockMinedListener: function (player, blockClassId) {
		player.laserBeam.destroy();
		player.laserBeam = undefined;
	},

	/**
	 * Called every time a ship collects a block
	 */
	blockCollectListener: function (player, blockClassId) {
		//TODO: Add a cool animation or sound here, or on another listener
		//console.log("Block collected!");
		player.cargo.addBlock(blockClassId);
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
				var location = this._box2dBody.GetWorldCenter(); //center of gravity

				var grid = this.grid();
				for (row = 0; row < grid.length; row++) {
					var blockRow = grid[row];
					for (col = 0; col < blockRow.length; col++) {
						var block = blockRow[col];

						if(block && block.classId() === "EngineBlock") {
							//TODO: Fixtures should have their own position in box2d units. Something like block.fixture().m_shape.m_centroid should work. But this is a little tricky because box2D fixtures don't seem to compute their own world coordinates or rotated offsets. They only store the unrotated offset. Talk with @rafaelCosman if you want help doing this TODO.

							// I'm deviding by 10 because that's the scale factor between IGE and Box2D
							var pointToApplyTo = {x: (this.translate().x() + block.translate().x()) / 10.0, y: (this.translate().y() - block.translate().y()) / 10.0};
							pointToApplyTo.x = 2 * this._box2dBody.GetWorldCenter().x - pointToApplyTo.x
							pointToApplyTo.y = 2 * this._box2dBody.GetWorldCenter().y - pointToApplyTo.y
							this._box2dBody.ApplyImpulse(impulse, pointToApplyTo);

						}
					}
				}
			}
		}

		BlockGrid.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
