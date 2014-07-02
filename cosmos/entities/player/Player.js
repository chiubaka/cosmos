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

	_username: undefined,

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
			this._initClient(data);
		} else {
			this._initServer();
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
	},

	streamCreateData: function() {
		var data = BlockStructure.prototype.streamCreateData.call(this);
		data.username = this.username();
		data.dbId = this.dbId();
		return data;
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

	isLoggedIn: function() {
		return this.dbId() !== undefined;
	},

	username: function(val) {
		if (val === undefined) {
			return this._username;
		}

		// Players can't change their username after they've chosen one!
		if (this._username) {
			return this;
		}

		this._username = val;
		if (!ige.isServer) {
			ige.emit('cosmos:player.username.set', this.id());
		}
		return this;
	},

	requestUsername: function(username) {
		if (!this.username()) {
			ige.network.send('cosmos:player.username.set.request', username);
		}
	},

	generateGuestUsername: function() {
		var guestNumber = Math.floor((Math.random() * 999999) + 100000);
		var guestUsername = 'guest' + guestNumber;
		this.username(guestUsername);
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
	_initClient: function(data) {
		var self = this;
		this.depth(Player.DEPTH);
		if (data !== undefined) {
			this.username(data.username);
			this.dbId(data.dbId);
		}

		// Either the username was already streamed, in which case it is here and we can create a label
		if (this.username()) {
			if (ige.client.player === undefined) {
				var playerStreamedListener = ige.on('cosmos:client.player.streamed', function() {
					self.createUsernameLabel();

					ige.off('cosmos:client.player.streamed', playerStreamedListener);
				});
			}
			else {
				this.createUsernameLabel();
			}
		}
		// Or it has not been streamed, which means that the player does not have a username on the server, either. In
		// this case, wait for the server to tell us that this player's username has been approved, then set the
		// username and draw the label.
		else {
			ige.on('cosmos:player.username.set.approve', function(data) {
				if (data.playerId === self.id()) {
					self.username(data.username);
					self.createUsernameLabel();
					if (self.id() === ige.client.player.id()) {
						ige.emit('cosmos:client.player.username.set', self.username());
					}
				}
			});
		}
	},

	createUsernameLabel: function() {
		// Don't create the username label again if it already exists. Also don't create a label for the client's
		// player.
		if (this.usernameLabel !== undefined ||
			(ige.client.player !== undefined && this.id() === ige.client.player.id())) {
			return;
		}
		var self = this;
		this.usernameLabel = $('<div>' + this.username() + '</div>').addClass('username-label tooltip');
		$('body').append(this.usernameLabel);

		var hoverTimer;

		// Make the username label "disappear" on hover. Cannot just hide the label, because there is no good condition
		// to make it show again. This makes the mousedown code below necessary so that we can send clicks through this
		// label to the canvas below.
		this.usernameLabel.hover(function() {
			if (hoverTimer !== undefined) {
				clearTimeout(hoverTimer);
			}
			$(this).css({opacity: 0});
		},
		function() {
			var label = $(this);
			hoverTimer = setTimeout(function() {
				// 400ms for duration is the default for fadeIn()
				label.fadeTo(400, 1);
			}, Player.USERNAME_LABEL_HYSTERESIS_INTERVAL);
		});

		// When the username label is clicked, construct a click event that looks like a regular IGE canvas click event
		// and pass it down to IGE.
		this.usernameLabel.mousedown(function(e) {
			self.dispatchClickToIge(e);
		});

		// Also need to pass mouse up events from the label down or the entity won't change its internal state to think
		// that the mouse down ended and won't allow additional clicks.
		this.usernameLabel.mouseup(function(e) {
			self.dispatchClickToIge(e);
		});

		var mouseOutTimer;

		this.mouseOver(function() {
			if (mouseOutTimer !== undefined) {
				clearTimeout(mouseOutTimer);
			}
			self.usernameLabel.hide();
		});

		this.mouseOut(function() {
			mouseOutTimer = setTimeout(function() {
				self.usernameLabel.fadeIn();
			}, Player.USERNAME_LABEL_HYSTERESIS_INTERVAL);
		});
	},

	dispatchClickToIge: function(e) {
		var igeCanvas = document.getElementById('igeFrontBuffer');
		var clickEvent = this.createIgeClickEvent(e);
		igeCanvas.dispatchEvent(clickEvent);
	},

	createIgeClickEvent: function(e) {
		var igeCanvas = document.getElementById('igeFrontBuffer');
		var clickEvent = document.createEvent('MouseEvent');
		clickEvent.initMouseEvent(
			e.type,
			e.bubbles,
			e.cancelable,
			e.view,
			1,
			e.screenX,
			e.screenY,
			e.clientX,
			e.clientY,
			e.ctrlKey,
			e.altKey,
			e.shiftKey,
			e.metaKey,
			e.button,
			null
		);
		clickEvent.srcElement = clickEvent.currentTarget = clickEvent.target = clickEvent.toElement = igeCanvas;
		return clickEvent;
	},

	destroyUsernameLabel: function() {
		// If there is no username label, there isn't anything to destroy
		if (this.usernameLabel === undefined) {
			return;
		}

		this.usernameLabel.remove();
		this.usernameLabel = undefined;
	},

	streamEntityValid: function(val) {
		if (val !== undefined) {
			if (val === false) {
				this.destroyUsernameLabel();
			}
			else {
				this.createUsernameLabel();
			}
		}

		return BlockStructure.prototype.streamEntityValid.call(this, val);
	},

	destroy: function() {
		this.destroyUsernameLabel();
		BlockStructure.prototype.destroy.call(this);
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

			// If this isn't the player playing on this client, draw a label to help identify this player
			if (this.usernameLabel !== undefined) {
				var screenPos = this.screenPosition();
				this.usernameLabel.css('left', Math.round(screenPos.x - this.usernameLabel.outerWidth() / 2));
				this.usernameLabel.css('top', Math.round(screenPos.y - this.usernameLabel.outerHeight() / 2));
			}

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
			var angularImpulse = -60 * numRotationalThrusters * ige._tickDelta;

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
				var linearImpulse = 3 * ige._tickDelta;
				if (this.controls.key.up) {
					linearImpulse = linearImpulse;
				}
				else if (this.controls.key.down) {
					linearImpulse = -linearImpulse;
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

Player.USERNAME_LABEL_HYSTERESIS_INTERVAL = 500;

Player.onUsernameRequested = function(username, clientId) {
	if (!ige.isServer) {
		return;
	}
	var player = ige.server.players[clientId];
	if (player === undefined) {
		return;
	}
	if (player.username()) {
		ige.network.send('cosmos:player.username.set.error', 'Player already has username ' + this._username, clientId);
		return;
	}

	if (!Player.usernameIsCorrectLength(username)) {
		ige.network.send('cosmos:player.username.set.error', 'Username must be between 5 and 12 characters', clientId);
	}
	else if (!Player.usernameIsAlphanumericUnderscore(username)) {
		ige.network.send('cosmos:player.username.set.error', 'Alphanumeric characters and underscores only', clientId);
	}

	// Find users with this name. Change username to lowercase for search to make sure that we don't allow different
	// capitalizations of the same name.
	DbPlayer.findByUsername(username.toLowerCase(), function(err, foundPlayer) {
		if (err) {
			console.error('Error finding player with username ' + username + '. Error: ' + err);
			ige.network.send('cosmos:player.username.set.error', 'Database error', clientId);
			return;
		}

		if (foundPlayer) {
			ige.network.send('cosmos:player.username.set.error', 'Username ' + username + ' is taken');
		}
		else {
			player.username(username);
			DbPlayer.update(player.dbId(), player, function(err) {
				if (err) {
					console.error('Error updating player ' + player.dbId() + '. Error: ' + err);
					ige.network.send('cosmos:player.username.set.error', 'Database error', clientId);
					return;
				}
				ige.network.send('cosmos:player.username.set.approve', {'playerId': player.id(), 'username': username});
			});
		}
	});
};

Player.onUsernameApproved = function(data) {
	ige.emit('cosmos:player.username.set.approve', data);
};

Player.onUsernameRequestError = function(error) {
	ige.emit('cosmos:player.username.set.error', error);
};

Player.usernameIsAlphanumericUnderscore = function(username) {
	var regex = /^([a-zA-Z0-9_])+$/;
	return regex.test(username);
};

Player.usernameIsCorrectLength = function(username) {
	return username.length >= 2 && username.length <= 12;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
