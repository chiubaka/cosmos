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
			console.log("callinfg init camerass");
			self.initCameras(player.currentShip());

			// Set the time stream UI entity to monitor our player entity
			// time stream data
			ige.client.tsVis.monitor(player);
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
				console.log("callinfg init camerass later!");
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				console.log("Event listener was called");
				if (entity.id() === data.entityId) {
					console.log("The player has been streamed!");
					var player = ige.$(data.entityId);

					// Tell the camera to track our player entity
					self.initCameras(player.currentShip());

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

	/**
	 * Initializes all of the cameras that need to track the ship.
	 * This is currently just one camera: the camera for the main viewport.
	 * The minimap doesn't actually use IGE, it uses HTML instead, and so it doesn't have a camera.
	 */
	initCameras: function(entityToTrack) {
		console.log("INIT CAMERAS!1");

		var cameraSmoothingAmount = 0;

		ige.$('mainViewport').camera.trackTranslate(entityToTrack, cameraSmoothingAmount);

		console.log("INIT CAMERAS!");
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
