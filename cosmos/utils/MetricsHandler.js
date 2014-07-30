/**
 * The MetricsHandler class handles in game metrics like what UI elements
 * are being clicked and FPS.
 * Currently, this uses Google Analytics.
 * @class
 * @typedef {Object} MetricsHandler
 * @namespace
 */
var MetricsHandler = IgeEventingClass.extend({
	classId: "MetricsHandler",
	/**
	 * Enables sending metrics to Google Analytics
	 * @memberof MetricsHandler
	 * @instance
	 */
	enabled: false,

	init: function() {
		console.info("Metrics: Initializing...");

		this.listenEvents();
	},

	/**
	 * Sets up event listeners to various events so we can report metrics on
	 * them.
	 * @memberof MetricsHandler
	 * @instance
	 */
	listenEvents: function() {
		var self = this;

		ige.on('ige network error', function() {
			analytics.track('ige network error');
		});

		ige.on('clientstate selected cap changed', function(selectedCap) {
			analytics.track('cosmos:clientstate selected cap changed',
				{
					'selectedCap': selectedCap
				});
		});

		ige.on('toolbar tool cleared', function(classId, toolName) {
			analytics.track('cosmos:toolbar tool cleared',
				{
					'classId': classId,
					'toolName': toolName
				});
		});

		ige.on('toolbar tool selected', function(classId, toolName) {
			analytics.track('cosmos:toolbar tool selected',
				{
					'classId': classId,
					'toolName': toolName
				});
		});

		ige.on('capbar cap selected', function(classId) {
			analytics.track('cosmos:capbar cap selected',
				{
					'classId': classId
				});
		});

		ige.on('capbar cap cleared', function(classId) {
			analytics.track('cosmos:capbar cap cleared',
				{
					'classId': classId
				});
		});

		ige.on('respawn button clicked', function() {
			analytics.track('cosmos:respawn button clicked');
		});

		ige.on('cosmos:client.player.login', function(username) {
			analytics.identify(username);

			analytics.people.set({
				"$last_login": new Date(),         // properties can be dates...
		    		"username": username
			});

			// send the event to analytics
			analytics.track('cosmos:client.player.login',
				{
					'username': username
				});
		});

		ige.on('cosmos:namePrompt.skipped', function() {
			analytics.track('cosmos:namePrompt.skipped');
		});

		this.on('cosmos:quest.tutorialQuest.clicked', function() {
			analytics.track('cosmos:quest.tutorialQuest.clicked');
		});

		this.on('cosmos:quest.tutorialQuest.skipped', function() {
			analytics.track('cosmos:quest.tutorialQuest.skipped');
		});

		this.on('cosmos:quest.tutorialQuest.completed', function() {
			analytics.track('cosmos:quest.tutorialQuest.completed');
		});
	}
});

MetricsHandler.PLAYER_DIMENSION = 'dimension1';
