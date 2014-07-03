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
		console.log("entityId: " + data.entityId);
		console.log("On player entity");

		var self = this;

		var player = ige.$(data.entityId)

		if (player) {
			// Set the time stream UI entity to monitor our player entity
			// time stream data
			ige.client.tsVis.monitor(player);
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
				console.log("calling init cameras later!");
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				console.log("Event listener was called");
				if (entity.id() === data.entityId) {
					console.log("The player has been streamed!");
					var player = ige.$(data.entityId);

					// Make it easy to find the player's entity
					ige.client.player = player;

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

					// Turn off the listener for this event now that we
					// have found and started tracking our player entity
					ige.network.stream.off('entityCreated', self._eventListener, function (result) {
						if (!result) {
							this.log('Could not disable event listener!', 'warning');
						}
					});
				}
			});
		}
	},

	_onShipEntity: function(data) {
		console.log("client network events onShipEntity:");

		if(ige.client.player && ige.$(data.entityId)) {
			console.log("adding ship to player now");
			console.log("here is the ship's classid:");
			console.log(ige.$(data.entityId).classId());

			ige.client.player.currentShip(ige.$(data.entityId));
			ige.network.send('cargoRequest', { requestUpdates: true });
		} else {
			console.log("adding ship to player later");
			if (!ige.client.player) {
				console.log("because play is not yet here");
				//save the ship for when the player does arrive
				ige.client.currentShip = ige.$(data.entityId);
			}

			if (!ige.$(data.entityId)) {
				console.log("because ship is not yet here");
				self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
					console.log("Event listener was called for the function defined in _onShipEntity");
					if (entity.id() === data.entityId) {

						// Make it easy to find the player's entity
						if (ige.client.player) {
							var player = ige.client.player;

							player.currentShip(ige.client.currentShip);
							console.log("current ship set!");
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
