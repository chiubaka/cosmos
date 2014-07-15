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
		ige.client.player = new Player()
			.mount(ige.$("spaceGameScene"));

		// Set the time stream UI entity to monitor our player entity
		// time stream data
		//ige.client.tsVis.monitor(ige.client.player);

		if (ige.client.currentShip) {
			console.log("adding ship now that player is here");
			ige.client.player.currentShip(ige.client.currentShip);
		} else {
			console.log("player is here but ship is not yet here");
		}

		ige.client.metrics.fireEvent('player', 'connect', data.playerId);

		// Set the time stream UI entity to monitor our player entity
		// time stream data
		//ige.client.tsVis.monitor(ige.$(data));
	},

	_onShipEntity: function(data) {
		if(ige.client.player && ige.$(data.entityId)) {

			ige.client.player.currentShip(ige.$(data.entityId));
			ige.network.send('cargoRequest', { requestUpdates: true });
		} else {
			//adding ship to player later
			if (!ige.client.player) {
				//save the ship for when the player does arrive
				ige.client.currentShip = ige.$(data.entityId);
			}

			if (!ige.$(data.entityId)) {
				self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
					if (entity.id() === data.entityId) {

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

						var username = ige.client.player.username();

						// If this player is logged in but doesn't yet have a username, prompt for one.
						if (ige.client.player.hasGuestUsername && ige.client.player.isLoggedIn()) {
							ige.client.promptForUsername();
						}
						else {
							ige.emit('cosmos:client.player.username.set', username);
						}

						ige.emit('cosmos:client.player.streamed');
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
