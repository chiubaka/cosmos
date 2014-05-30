var MetricsHandler = IgeClass.extend({
	classId: "MetricsHandler",

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
	
	listenEvents: function() {
		var self = this;

		ige.on('ige network error', function() {
			self.fireEvent('network', 'error');
			self.fireEvent('engine', 'stop');
		});

		ige.on('clientstate selected cap changed', function(selectedCap) {
			self.firePage(selectedCap);
		});

		ige.on('toolbar tool cleared', function(classId, toolName) {
			self.fireEvent('tool', 'clear', classId + "-" + toolName);
		});

		ige.on('toolbar tool selected', function(classId, toolName) {
			self.fireEvent('tool', 'click', classId + "-" + toolName);
		});

		ige.on('capbar cap selected', function(classId) {
			self.fireEvent('cap', 'click', classId);
		});

		ige.on('capbar cap cleared', function(classId) {
			self.fireEvent('cap', 'clear', classId);
		});

		ige.on('respawn button clicked', function() {
			self.fireEvent('respawn', 'click');
		});
	},

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

	fireEvent: function(category, action, label, value) {
		if (!this.enabled) {
			return;
		}
		if (label !== undefined) {
			console.info("Metrics: [EVENT] " + category + "/" + action + " - " + label);
		} else {
			console.info("Metrics: [EVENT] " + category + "/" + action);
		}
		ga('send', 'event', category, action, label, value);
	},
});

MetricsHandler.PLAYER_DIMENSION = 'dimension1';