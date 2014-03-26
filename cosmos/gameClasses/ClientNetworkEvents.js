var ClientNetworkEvents = {
	/**
	 * Is called when a network packet with the "playerEntity" command
	 * is received by the client from the server. This is the server telling
	 * us which entity is our player entity so that we can track it with
	 * the main camera!
	 * @param data The data object that contains any data sent from the server.
	 * @private
	 */
	_onPlayerEntity: function (data) {
		var cameraSmoothingAmount = 10;
		var minimapScale = .1;

		if (ige.$(data)) {
			// Tell the camera to track our player entity
			ige.$('minimapViewport').camera.trackTranslate(ige.$(data), cameraSmoothingAmount);
			ige.$('minimapViewport').camera.scaleTo(minimapScale, minimapScale, 1);

			// tell the minimap camera to track our player entity as well
			ige.$('spaceViewport').camera.trackTranslate(ige.$(data), cameraSmoothingAmount);

			// Set the time stream UI entity to monitor our player entity
			// time stream data
			ige.client.tsVis.monitor(ige.$(data));
		} else {
			// The client has not yet received the entity via the network
			// stream so lets ask the stream to tell us when it creates a
			// new entity and then check if that entity is the one we
			// should be tracking!
			var self = this;
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
				if (entity.id() === data) {
					// Tell the camera to track our player entity
					ige.$('minimapViewport').camera.trackTranslate(ige.$(data), cameraSmoothingAmount);
					ige.$('minimapViewport').camera.scaleTo(minimapScale, minimapScale, 1);

					// tell the minimap camera to track our player entity as well
					ige.$('spaceViewport').camera.trackTranslate(ige.$(data), cameraSmoothingAmount);

					// Set the time stream UI entity to monitor our player entity
					// time stream data
					ige.client.tsVis.monitor(ige.$(data));

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
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
