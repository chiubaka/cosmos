var TutorialQuest = Quest.extend({
	classId: 'TutorialQuest',


	init: function(instance) {
		Quest.prototype.init.call(this, instance);
		this.isComplete = false;
		this.questState = this.welcome;
		if (ige.isServer) {
			this.on(this.keys['welcome.action'], this.welcome.verify);
		}
	},

	keys: {
		'welcome.action': '1',
	},

	welcome: {
		condition: function() {
			return true;
		},
		action: function() {
			if (ige.isClient) {
				var self = this;
				var message = "Welcome to Cosmos!";
				self.on('cosmos:TutorialQuest.welcome.continue', function () {
					self.questState = self.complete;
				});

				ige.notification.notificationUI.popupAlert(message, function () {
					console.log('Button pressed!');
					ige.questSystem.eventToServer(self.keys['welcome.action'], self);
				});
			}
		},
		// @server-side
		verify: function() {
			console.log('Server verify');
		}
	},

	complete: {
		condition: function() {
			return true;
		},
		action: function() {
			this.isComplete = true;
		}
	},



});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = TutorialQuest; }
