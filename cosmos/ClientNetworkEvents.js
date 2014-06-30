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
		var self = this;

		if (ige.$(data.entityId)) {
			ClientNetworkEvents.initCameras(ige.$(data.entityId));

			// Set the time stream UI entity to monitor our player entity
			// time stream data
			ige.client.tsVis.monitor(ige.$(data.entityId));
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				if (entity.id() === data.entityId) {
					var player = entity;
					// Tell the camera to track out player entity
					ClientNetworkEvents.initCameras(ige.$(data.entityId));

					// Make it easy to find the player's entity
					ige.client.player = player;

					ige.client.metrics.fireEvent('player', 'connect', data.playerId);

					ige.network.send('cargoRequest', { requestUpdates: true });

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

					var username = player.username();

					// If there is already a valid username, then we're good to go!
					if (username) {
			
					}
					// If there isn't, but the player is logged in, we should ask to set a username.
					else if (player.isLoggedIn()) {
						ige.client.promptForUsername();
					}
					// If there isn't and the player isn't logged in, we should just assign a guest username.
					else {
						player.generateGuestUsername();
					}
				}
			});
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

	initCameras: function(entityToTrack) {
		var cameraSmoothingAmount = 0;

		ige.$('mainViewport').camera.trackTranslate(entityToTrack, cameraSmoothingAmount);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
