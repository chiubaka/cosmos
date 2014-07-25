/**
 * ClientNetworkEvents stores functions that are called as a result of network events.
 * When adding a new event to this class, make sure to link it with the appropriate network event in client.js. For example,
 * ige.network.define('playerEntity', self._onPlayerEntity);
 * links the network event 'playerEntity' to the function _onPlayerEntity.
 * If you don't do this, your function won't ever be called.
 */
var ClientNetworkEvents = {
	/**
	 * Is called when a network packet with the "playerEntity" command
	 * is received by the client from the server. This is the server telling
	 * us which entity is our player entity so that we can track it with
	 * the main camera!
	 * @param data The data object that contains any data sent from the server.
	 * @private
	 */
	_onPlayerEntity: function(data) {
		ige.client.player = new Player();
		ige.client.player.id(data.playerId);
		ige.client.player.username(data.username);
		ige.client.player.loggedIn(data.loggedIn);
		ige.client.player.mount(ige.$("spaceGameScene"));

		ige.client.player.hasGuestUsername = data.hasGuestUsername;

		// Set the time stream UI entity to monitor our player entity
		// time stream data
		//ige.client.tsVis.monitor(ige.client.player);

		if (ige.client.currentShip) {
			ige.client.player.currentShip(ige.client.currentShip);
		}

		ige.client.metrics.fireEvent('player', 'connect', data.playerId);

		// If this player is logged in and has a guest username, prompt for a real
		// username.
		if (ige.client.player.loggedIn() && ige.client.player.hasGuestUsername) {
			ige.client.promptForUsername();
		}
		else {
			ige.emit('cosmos:client.player.username.set', ige.client.player.username());
		}

		ige.emit('cosmos:client.player.streamed');

		// Set the time stream UI entity to monitor our player entity
		// time stream data
		//ige.client.tsVis.monitor(ige.$(data));
	},

	_onPlayerConnected: function(data) {
		if (ige.client.player.id === data.playerId || ige.$(data.playerId)) {
			return;
		}

		var player = new Player().id(data.playerId)
			.username(data.username)
			.loggedIn(data.loggedIn)
			.mount(ige.$("spaceGameScene"));

		player.hasGuestUsername = data.hasGuestUsername;

		if (ige.$(data.shipId)) {
			player.currentShip(ige.$(data.shipId));
		}
	},

	_onPlayerDisconnected: function(data) {
		var player = ige.$(data);
		if (player) {
			player.destroy();
		}
	},

	/*
	This is how the server assembles the data to send us:
	var sendData = {
		shipId: player.currentShip().id()
	}
	*/
	// TODO: Refactor this code to use the paradigm where the ship sends the playerId in streamCreateData and where
	// messages that create players send down the shipId. This way, it's pretty well-defined that either we're ready
	// when the player is received or when the ship is received and every player and every ship can be paired to the
	// appropriate extant entity.
	_onShipEntity: function(data) {
		if(ige.client.player && ige.$(data.shipId)) {

			ige.client.player.currentShip(ige.$(data.shipId));
			ige.network.send('cargoRequest', { requestUpdates: true });
		} else {
			//adding ship to player later
			if (!ige.client.player) {
				//save the ship for when the player does arrive
				ige.client.currentShip = ige.$(data.shipId);
			}

			if (!ige.$(data.shipId)) {
				self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
					if (entity.id() === data.shipId) {

						if (ige.client.player) {
							ige.client.player.currentShip(entity);
							ige.network.send('cargoRequest', { requestUpdates: true });
						}

						// Set the time stream UI entity to monitor our player entity
						// time stream data
						//ige.client.tsVis.monitor(ige.$(data));

						// Turn off the listener for this event now that we
						// have found and started tracking our player entity
						ige.network.stream.off('entityCreated', self._eventListener, function (result) {
							if (!result) {
								this.log('Could not disable event listener!', 'warning');
							}
						});

						ige.emit('cosmos:client.ship.streamed');
						ige.removeLoadingScreen();
					}
				});
			}
		}
	},

	_onBlockAction: function(data) {
		var blockGrid = ige.$(data.blockGridId);
		blockGrid.processBlockActionClient(data);
	},

	_onMinedBlock: function(data) {
		ige.emit('cosmos:BlockStructure.processBlockActionServer.minedBlock');
	},

	_onAddEffect: function(effect) {
		var blockGrid = ige.$(effect.sourceBlock.blockGridId);
		blockGrid.addEffect(effect);
	},

	_onRemoveEffect: function(effect) {
		var blockGrid = ige.$(effect.sourceBlock.blockGridId);
		blockGrid.removeEffect(effect);
	},

	_onCargoResponse: function(cargoList) {
		//console.log("Received cargo response", 'info');
		ige.emit('cargo response', [cargoList]);
	},

	_onCargoUpdate: function(cargoList) {
		//console.log("Received cargo update", 'info');
		ige.emit('cargo update', [cargoList]);
	},

	_onConfirm: function(data) {
		ige.client.metrics.fireEvent(data.category, data.action, data.label);
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
