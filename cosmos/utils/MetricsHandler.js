﻿/**
 * The MetricsHandler class handles in game metrics like what UI elements
 * are being clicked and FPS.
 * Currently, this uses Segment.io.
 * @class
 * @typedef {Object} MetricsHandler
 * @namespace
 */
var MetricsHandler = IgeEventingClass.extend({
	classId: "MetricsHandler",

	validStrings: undefined,

	init: function() {
		console.info("Metrics: Initializing...");

		this.validStrings = {
			/* Tutorial Quest */
			"cosmos:quest.tutorialQuest.clicked": true, // This is fired when you click "ok", I will take the tutorial. The alternative is to cancel the tutorial.
			"cosmos:quest.tutorialQuest.skipped": true,
			"cosmos:quest.tutorialQuest.welcome.completed": true,
			"cosmos:quest.tutorialQuest.moveForward.completed": true,
			"cosmos:quest.tutorialQuest.moveBackwards.completed": true,
			"cosmos:quest.tutorialQuest.rotateLeft.completed": true,
			"cosmos:quest.tutorialQuest.rotateRight.completed": true,
			"cosmos:quest.tutorialQuest.moveAround.completed": true,
			"cosmos:quest.tutorialQuest.minimap.completed": true,
			"cosmos:quest.tutorialQuest.mine.completed": true,
			"cosmos:quest.tutorialQuest.cargo.completed": true,
			"cosmos:quest.tutorialQuest.craft.completed": true,
			"cosmos:quest.tutorialQuest.construct.completed": true,
			"cosmos:quest.tutorialQuest.chat.completed": true,
			"cosmos:quest.tutorialQuest.newShip.completed": true,
			"cosmos:quest.tutorialQuest.completed": true,

			/* player */
			"cosmos:player.connect": true, // This is fired when the game has been loaded and _onPlayerEntity is called on the client
			"cosmos:player.attack": true,
			'cosmos:player.relocate.mouseDown': true,
			'cosmos:player.newShip.mouseDown': true,

			/* engine */
			"cosmos:engine.performance": true,

			/* network */
			"cosmos:network.connect": true,

			/* construction */
			"cosmos:construct.attempt.new": true,
			"cosmos:construct.new": true,

			"cosmos:construct.attempt.existing": true,
			"cosmos:construct.existing": true,

			/* crafting */
			"cosmos:CraftingSystem.craft.success": true,

			/* misc */
			"cosmos:block.mine": true,
			"cosmos:block.attack": true//note that this includes when you mine yourself as well as when you mine other players
		}
	},

	track: function(event, data) {
		if (!this.validStrings[event]) {
			this.log("The invalid event " + event + " was sent to the metrics handler. Prepare to die.", "error");
		}

		analytics.track(event, data);
	}
});

MetricsHandler.PLAYER_DIMENSION = 'dimension1';
