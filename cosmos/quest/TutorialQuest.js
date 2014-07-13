var TutorialQuest = Quest.extend({
	classId: 'TutorialQuest',


	init: function(instance) {
		Quest.prototype.init.call(this, instance);

		if (ige.isClient) {
			this.questState = this.welcome;
		}

		if (ige.isServer) {
			this.on(this.keys['welcome.action'], this.welcome.server);
		}
	},

	keys: {
		'welcome.action': '1',
	},

	welcome: {
		once: function() {
			var self = this;
			// Show a pop up box welcoming the player
			var message = "Welcome to Cosmos!";
			ige.notification.notificationUI.popupAlert(message, function () {
				ige.questSystem.eventToServer(self.keys['welcome.action'], self);
				this.questState = this.moveForward;
			});
		},

		client: function() {
			
		},
		// @server-side
		server: function() {
			console.log('Server verify');
		}
	},

	moveForward: {
		once: function () {
			alertify.log('Move forward by pressing the W key', '', 0);
			var listener = ige.input.on('inputEvent', function () {
				alertify.success('Good! You\'ve moved forward!');
				ige.input.off('inputEvent', listener);
				this.questState = this.mine;
			});
		},

		client: function() {
		}
	},

	mine: {
		once: function() {
			alertify.log('Mine a block', '', 0);
		},

		client: function() {
		},

		server: function() {
		}

	},

	complete: {
		client: function() {
		},
		server: function() {
			//Remove quest
		}
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = TutorialQuest; }
