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
var Player = IgeEntity.extend({
	classId: 'Player',

	/**
	 * The session ID associated with this player's client and current session.
	 * @type {string}
	 * @memberof Player
	 * @private
	 * @instance
	 */
	_sid: undefined,
	_loggedIn: undefined,
	_username: undefined,
	_usernameLabel: undefined,
	hasGuestUsername: undefined,

	/**
	* The player's controls object. This represents the state of the player's instructions to to the game, like which keys are depressed.
	* Network messages are used to keep this property in sync between the server and the client.
	*/
	_controls: undefined,
	// Keep track of previous values so we can send the client notifications only
	// on a change.
	_prevControls: undefined,
	_prevMovementBlocks: undefined,

	/**
	 * The clientId associated with the player. Used to send notifications to
	 * a specific player.
	 * @type {string}
	 * @memberof Player
	 * @private
	 * @instance
	 */
	 _clientId: undefined,

	/**
	 * The Ship object that this player is currently controlling. At some point, players may be able to control more than one ship.
	 * Right now a player can only control one ship.
	 */
	_currentShip: undefined,

	init: function() {
		IgeEntity.prototype.init.call(this);

		this._controls = {
			key: {
				left: false,
				right: false,
				up: false,
				down: false
			}
		};

		this._prevControls = {
			key: {
				left: false,
				right: false,
				up: false,
				down: false
			}
		};

		this.addComponent(CraftingComponent);
		this.addComponent(QuestComponent);
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

	loggedIn: function(val) {
		if (val === undefined) {
			return this._loggedIn;
		}
		this._loggedIn = val;
		return this;
	},

	/*
	Getter and setter for the _username property
	*/
	username: function(val) {
		if (val === undefined) {
			return this._username;
		}

		// Players can't change their username after they've chosen one!
		if (!this.hasGuestUsername && this._username) {
			return this;
		}

		this._username = val;

		if (ige.isClient) {
			this._createUsernameLabel();
			this._usernameLabel.text(this._username);
		}

		return this;
	},

	requestUsername: function(username) {
		if (!this.username() || this.hasGuestUsername) {
			ige.network.send('cosmos:player.username.set.request', username);
		}
	},

	generateGuestUsername: function() {
		var guestNumber = Math.floor((Math.random() * 999999) + 100000);
		var guestUsername = 'guest' + guestNumber;
		this.hasGuestUsername = true;
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

	/*
	TODO: the usernames should really be a part of the ship, instead of the player object.
	Because only when a ship is streamed to you do you potentially care about that player.
	Otherwise you don't need the player data at all.
	*/
	_createUsernameLabel: function() {
		// Don't create the username label again if it already exists.
		if (this._usernameLabel !== undefined) {
			return;
		}
		var self = this;
		this._usernameLabel = $('<div>' + this.username() + '</div>').addClass('username-label tooltip');
		$('body').append(this._usernameLabel);

		var hoverTimer;

		// Make the username label "disappear" on hover. Cannot just hide the label, because there is no good condition
		// to make it show again. This makes the mousedown code below necessary so that we can send clicks through this
		// label to the canvas below.
		this._usernameLabel.hover(function() {
			if (hoverTimer !== undefined) {
				clearTimeout(hoverTimer);
			}
			$(this).css({opacity: 0});
		},
		function() {
			var label = $(this);
			hoverTimer = setTimeout(function() {
				// 400ms for duration is the default for fadeIn()
				label.fadeTo(Player.USERNAME_LABEL_FADE_IN_DURATION, 1);
			}, Player.USERNAME_LABEL_HYSTERESIS_INTERVAL);
		});

		// When the username label is clicked, construct a click event that looks like a regular IGE canvas click event
		// and pass it down to IGE.
		this._usernameLabel.mousedown(function(e) {
			self.dispatchClickToIge(e);
		});

		// Also need to pass mouse up events from the label down or the entity won't change its internal state to think
		// that the mouse down ended and won't allow additional clicks.
		this._usernameLabel.mouseup(function(e) {
			self.dispatchClickToIge(e);
		});

		var mouseOutTimer; // this will store the numerical ID of the timeout. As in mouseOutTimer = setTimeout(...)

		this.mouseOver(function() {
			if (mouseOutTimer !== undefined) {
				clearTimeout(mouseOutTimer);
			}
			self._usernameLabel.hide();
		});

		this.mouseOut(function() {
			mouseOutTimer = setTimeout(function() {
				self._usernameLabel.fadeIn();
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

	_destroyUsernameLabel: function() {
		// If there is no username label, there isn't anything to destroy
		if (this._usernameLabel === undefined) {
			return;
		}

		this._usernameLabel.remove();
		this._usernameLabel = undefined;
	},

	/**
	 * TODO fix this comment
	 * Override the {@link IgeEntity#update} function to provide support for player controls and {@link Block} functions
	 * like applying force where {@link EngineBlock}s are or turning faster when there are more {@link ThrusterBlock}s.
	 * @param ctx {Object} The render context.
	 * @memberof Player
	 * @instance
	 */
	update: function(ctx) {
		IgeEntity.prototype.update.call(this, ctx);

		if (!ige.isServer) {
			// If this isn't the player playing on this client, draw a label to help identify this player
			if (this._usernameLabel !== undefined && (ige.client.player && ige.client.player.id() !== this.id()) && this.currentShip()) {
				var screenPos = this.currentShip().screenPosition();
				this._usernameLabel.css('left', Math.round(screenPos.x - this._usernameLabel.outerWidth() / 2));
				this._usernameLabel.css('top', Math.round(screenPos.y - this._usernameLabel.outerHeight() / 2));
			}

			/* Save the old control state for comparison later */
			oldControls = JSON.stringify(this._controls);

			/* Modify the KEYBOARD controls to reflect which keys the client currently is pushing */
			this.controls().key.up =
				ige.input.actionState('key.up') | ige.input.actionState('key.up_W');
			this.controls().key.down =
				ige.input.actionState('key.down') | ige.input.actionState('key.down_S');
			this.controls().key.left =
				ige.input.actionState('key.left') | ige.input.actionState('key.left_A');
			this.controls().key.right =
				ige.input.actionState('key.right') | ige.input.actionState('key.right_D');

			if (JSON.stringify(this._controls) !== oldControls) { //this._controls !== oldControls) {
				// Tell the server about our control change
				ige.network.send('playerControlUpdate', this._controls);
			}
		}
	},

	/**
	 * Getter and setter for the controls property.
	 */
	controls: function(newControls) {
		if (newControls) {
			this._controls = newControls;

			newShipControls = {};
			newShipControls.up = this._controls.key.up;
			newShipControls.down = this._controls.key.down;
			newShipControls.left = this._controls.key.left;
			newShipControls.right = this._controls.key.right;

			this.currentShip().controls(newShipControls);

			return this;
		}

		return this._controls;
	},

	/**
	 * Getter and setter for the _currentShip property
	 */
	currentShip: function(newCurrentShip) {
		if (newCurrentShip !== undefined) {
			this._currentShip = newCurrentShip;
			//Give the new ship a reference back to this player object
			this._currentShip.player(this);

			if (!ige.isServer) {
					/**
					* Initializes all of the cameras that need to track the ship.
					* This is currently just one camera: the camera for the main viewport.
					* The minimap doesn't actually use IGE, it uses HTML instead, and so it doesn't have a camera.
					*/
				var cameraSmoothingAmount = 0;

				if (ige.client.player && ige.client.player.id() === this.id()) {
					ige.$('mainViewport').camera.trackTranslate(this._currentShip, cameraSmoothingAmount);
				}
			}

			// Update previous controls so we can tell what has changed each update.
			// We want to send engine missing notifications on a change, not every
			// update
			this._prevControls = JSON.parse(JSON.stringify(this._controls));
			return this;
		}

		return this._currentShip;
	},

	/*
	toJSON returns a dictionary that containts the public members of this player class.
	Note that toJSON should not return any members that are not meant to be read by all game clients.
	*/
	toJSON: function() {
		return {
			playerId: this.id(),
			username: this.username(),
			hasGuestUsername: this.hasGuestUsername,
			loggedIn: this.loggedIn(),
			shipId: this.currentShip().id()
		}
	}
});

Player.USERNAME_LABEL_FADE_IN_DURATION = 400;
Player.USERNAME_LABEL_HYSTERESIS_INTERVAL = 500;

Player.onUsernameRequested = function(username, clientId) {
	if (!ige.isServer) {
		return;
	}

	var player = ige.server.players[clientId];
	if (player === undefined) {
		return;
	}

	if (!player.hasGuestUsername && player.username()) {
		//This should never be sent unless someone screws with the client:
		ige.network.send('cosmos:player.username.set.error', 'Player already has username ' + player.username(), clientId);
		console.log("Player already has username: " + player.username());
		return;
	}

	if (!Player.usernameIsCorrectLength(username)) {
		ige.network.send('cosmos:player.username.set.error', 'Username must be between 2 and 12 characters', clientId);
	}
	else if (!Player.usernameIsAlphanumericUnderscore(username)) {
		ige.network.send('cosmos:player.username.set.error', 'Alphanumeric characters and underscores only', clientId);
	}

	DbPlayer.findByUsername(username, function(err, foundPlayer) {
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
			player.hasGuestUsername = false;
			DbPlayer.update(player.id(), player, function(err) {
				if (err) {
					console.error('Error updating player ' + player.id() + '. Error: ' + err);
					ige.network.send('cosmos:player.username.set.error', 'Database error', clientId);
					return;
				}
				ige.network.send('cosmos:player.username.set.approve', {'playerId': player.id(), 'username': username});
			});
		}
	});
};

Player.onUsernameRequestApproved = function(data) {
	ige.emit('cosmos:player.username.set.approve', data);

	var player = ige.$(data.playerId);
	if (player) {
		player.username(data.username);
		player.hasGuestUsername = false;

		if (ige.client.player && ige.client.player.id() === player.id()) {
			ige.emit('cosmos:client.player.username.set', player.username());
		}
	}
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
