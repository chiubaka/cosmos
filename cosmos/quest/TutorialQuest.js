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
			// Show a pop up box welcoming the player
			var message = "Welcome to Cosmos!";
			var close = alertify.questLog(message, '', 5000);
			ige.questSystem.eventToServer(this.keys['welcome.action'], this);
			this.questState = this.moveForward;
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
			var self = this;
			var close = alertify.persistentLog('Move forward by pressing the W key');
			var listener = ige.input.on('inputEvent', function () {
				alertify.success('Good! You\'ve moved forward!');
				ige.input.off('inputEvent', listener);
				close();
				self.questState = self.mine;
			});
		},

		client: function() {
		}
	},

	mine: {
		once: function() {
			var self = this;
			var close = alertify.persistentlog('Mine a block');
			var listener = ige.on('cosmos:block.mousedown', function () {
				alertify.success('Good! You\'ve mined a block!');
				ige.off('cosmos:block.mousedown', listener);
				close();
			});
		},

		client: function() {
		},

		server: function() {
		}
	},

	cargo: {
	},

	craft: {
	},

	construct: {
	},

	chat: {
	},

	relocate: {
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
