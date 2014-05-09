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

		if (ige.$(data)) {
			ClientNetworkEvents.initCameras(ige.$(data));

			// Set the time stream UI entity to monitor our player entity
			// time stream data
			ige.client.tsVis.monitor(ige.$(data));
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				if (entity.id() === data) {
					// Tell the camera to track out player entity
					ClientNetworkEvents.initCameras(ige.$(data));

					// Make it easy to find the player's entity
					ige.client.player = entity;

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

	_onCargoResponse: function(cargoList) {
		//console.log("Received cargo response", 'info');
		ige.emit('cargo response', [cargoList]);
	},

	_onCargoUpdate: function(cargoList) {
		//console.log("Received cargo update", 'info');
		ige.emit('cargo update', [cargoList]);
	},

	initCameras: function(entityToTrack) {
		var cameraSmoothingAmount = 0;

		ige.$('mainViewport').camera.trackTranslate(entityToTrack, cameraSmoothingAmount);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
