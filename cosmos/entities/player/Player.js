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
	 * The clientId associated with the player. Used to send notifications to
	 * a specific player.
	 * @type {string}
	 * @memberof Player
	 * @private
	 * @instance
	 */
	 _clientId: undefined,

	/**
	 * The player's controls object. This represents the state of the player's instructions to to the game, like which keys are depressed.
	 * Network messages are used to keep this property in sync between the server and the client.
	 */
	_controls: undefined,

	/**
	 * The Ship object that this player is currently controlling. At some point, players may be able to control more than one ship.
	 * Right now a player can only control one ship.
	 */
	_currentShip: undefined,

	init: function(data) {
		IgeEntity.prototype.init.call(this, data);

		var self = this;//TODO remove this line

		this._controls = {
			key: {
				left: false,
				right: false,
				up: false,
				down: false
			}
		};

		//TODO I"m going to construct this ship on the server and then send a message to the client telling him that this is his ship. He's then going to set the currentship property of his player.
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
	 * Checks if the player is able to mine
	 * @memberof Player
	 * @instance
	 * @return {Boolean} True if player can mine
	 */
	 canMine: function () {
		if (!this.currentShip().canMine()) {
			ige.network.stream.queueCommand('notificationError',
				NotificationDefinitions.errorKeys.noMiningLaser, this.clientId());
			return false;
		}
		return true;
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
			//console.log("update is called on client");

			/* Save the old control state for comparison later */
			oldControls = JSON.stringify(this.controls());

			/* Modify the KEYBOARD controls to reflect which keys the client currently is pushing */
			this.controls().key.up =
				ige.input.actionState('key.up') | ige.input.actionState('key.up_W');
			this.controls().key.down =
				ige.input.actionState('key.down') | ige.input.actionState('key.down_S');
			this.controls().key.left =
				ige.input.actionState('key.left') | ige.input.actionState('key.left_A');
			this.controls().key.right =
				ige.input.actionState('key.right') | ige.input.actionState('key.right_D');

			if (JSON.stringify(this.controls()) !== oldControls) {
				console.log("contols have changed! sending update to server");
				console.log("from");
				console.log(oldControls);
				console.log("to");
				console.log(this.controls());

				// Tell the server about our control change
				ige.network.send('playerControlUpdate', this.controls());
			}/*
			else {
				console.log("controls have not changed : ()");
			}*/
		}
	},

	/**
	 * Getter and setter for the controls property.
	 */
	controls: function(newControls) {
		if (newControls) {
			this._controls = newControls;

			this.currentShip().controls.up = this._controls.key.up;
			this.currentShip().controls.down = this._controls.key.down;
			this.currentShip().controls.left = this._controls.key.left;
			this.currentShip().controls.right = this._controls.key.right;

			console.log("controls of the player have been set to the following:");
			console.log(newControls);

			return this;
		}

		return this._controls;
	},

	/**
	 * Getter and setter for the _currentShip property
	 */
	currentShip: function(newCurrentShip) {
		if (newCurrentShip !== undefined) {
			console.log("finally setting current ship!");
			console.log("with the following id:");
			console.log(newCurrentShip.id());
			console.log("by the way, this player's id is:");
			console.log(this.id());

			this._currentShip = newCurrentShip;

			if (!ige.isServer) {
					/**
					* Initializes all of the cameras that need to track the ship.
					* This is currently just one camera: the camera for the main viewport.
					* The minimap doesn't actually use IGE, it uses HTML instead, and so it doesn't have a camera.
					*/
				var cameraSmoothingAmount = 0;

				ige.$('mainViewport').camera.trackTranslate(this._currentShip, cameraSmoothingAmount);
			}

			return this;
		}

		return this._currentShip;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
