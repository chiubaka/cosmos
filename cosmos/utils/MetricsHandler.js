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

		if (ga !== undefined) {
			console.info("Metrics: Google Analytics found, metrics are go!");
			this.enabled = true;
			this.fireEvent('metrics', 'start');
			this.fireEvent('engine', 'start');
		}

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
			self.fireEvent('network', 'error');
			self.fireEvent('engine', 'stop');

			// send the event to analytics
			analytics.track('ige network error');
		});

		ige.on('clientstate selected cap changed', function(selectedCap) {
			self.firePage(selectedCap);

			// send the event to analytics
			analytics.track('clientstate selected cap changed',
				{
					'selectedCap': selectedCap
				});
		});

		ige.on('toolbar tool cleared', function(classId, toolName) {
			self.fireEvent('tool', 'clear', classId + "-" + toolName);

			// send the event to analytics
			analytics.track('toolbar tool cleared',
				{
					'classId': classId,
					'toolName': toolName
				});
		});

		ige.on('toolbar tool selected', function(classId, toolName) {
			self.fireEvent('tool', 'click', classId + "-" + toolName);

			// send the event to analytics
			analytics.track('toolbar tool selected',
				{
					'classId': classId,
					'toolName': toolName
				});
		});

		ige.on('capbar cap selected', function(classId) {
			self.fireEvent('cap', 'click', classId);

			// send the event to analytics
			analytics.track('capbar cap selected',
				{
					'classId': classId
				});
		});

		ige.on('capbar cap cleared', function(classId) {
			self.fireEvent('cap', 'clear', classId);

			// send the event to analytics
			analytics.track('capbar cap cleared',
				{
					'classId': classId
				});
		});

		ige.on('respawn button clicked', function() {
			self.fireEvent('respawn', 'click');

			// send the event to analytics
			analytics.track('respawn button clicked');
		});

		ige.on('cosmos:client.player.login', function(username) {
			self.fireEvent('player', 'login', username);

			//analytics
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
			self.fireEvent('namePrompt', 'skipped');

			// send the event to analytics
			analytics.track('cosmos:namePrompt.skipped');
		});

		this.on('cosmos:quest.tutorialQuest.clicked', function() {
			self.fireEvent('tutorialQuest', 'clicked');

			// send the event to analytics
			analytics.track('cosmos:quest.tutorialQuest.clicked');
		});

		this.on('cosmos:quest.tutorialQuest.skipped', function() {
			self.fireEvent('tutorialQuest', 'skipped');

			// send the event to analytics
			analytics.track('cosmos:quest.tutorialQuest.skipped');
		});

		this.on('cosmos:quest.tutorialQuest.completed', function() {
			self.fireEvent('tutorialQuest', 'completed');

			// send the event to analytics
			analytics.track('cosmos:quest.tutorialQuest.completed');
		});

	},

	/**
	 * Fires a Google Analytics pageview event
	 * @param page {String} Page are currently used to distinguish between
	 * different capabilities activated.
	 * @param title {String} Titles are currently unused.
	 * @memberof MetricsHandler
	 * @instance
	 */
	firePage: function(page, title) {
		if (!this.enabled) {
			return;
		}
		console.info("Metrics: [PAGEVIEW] " + page);
		if (title === undefined) {
			ga('send', 'pageview', page);
			return;
		} else {
			ga('send', 'pageview', {
				'page': page,
				'title': title
			});
		}
	},

	/**
	 * Fires a Google Analytics event
	 * @param category {String} Major category of event, e.g. construct
	 * @param action {String} Action of event, e.g. existing
	 * @param label {String} Label of event, e.g. CarbonBlock
	 * @param value {String=} Specific value (optional) used for FPS value
	 * @memberof MetricsHandler
	 * @instance
	 */
	fireEvent: function(category, action, label, value) {
		if (!this.enabled) {
			return;
		}
		if (label !== undefined) {
			console.info("Metrics: [EVENT] " + category + "/" + action + " - " + label);
		} else {
			console.info("Metrics: [EVENT] " + category + "/" + action);
		}

		// send the event to Google Analytics
		ga('send', 'event', category, action, label, value);
	},
});

MetricsHandler.PLAYER_DIMENSION = 'dimension1';
