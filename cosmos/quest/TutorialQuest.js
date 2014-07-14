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
			//ige.questSystem.eventToServer(this.keys['welcome.action'], this);
			this.questState = this.cargo;
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
			var close = alertify.questLog('Now, move forward by pressing the W key');
			var listener = ige.input.on('keyDown', function (event, keyCode) {
				if (keyCode === ige.input.key.w) {
					alertify.questLog('Good! You\'ve moved forward!', 'success', 5000);
					ige.input.off('keyDown', listener);
					close();
					self.questState = self.mine;
				}
			});
		},

		client: function() {
		}
	},

	mine: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, mine a block');
			var listener = ige.on('cosmos:block.mousedown', function () {
				alertify.questLog('Good! You\'ve mined a block!', 'success', 5000);
				ige.off('cosmos:block.mousedown', listener);
				close();
				self.questState = self.cargo;
			});
		},

		client: function() {
		},

		server: function() {
		}
	},

	cargo: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, click the cargo button');
			// Show the tooltip
			ige.hud.leftToolbar.windows.cargo.button.tooltipster('show');
			var listener = ige.on('cosmos:CargoComponent.buttonClicked', function (classId) {
				alertify.questLog('Good! You\'ve opened the cargo!', 'success', 5000);
				ige.off('cosmos:CargoComponent.buttonClicked', listener);
				close();
				// Hide the tooltip
				ige.hud.leftToolbar.windows.cargo.button.tooltipster('hide');
				self.questState = self.craftOpen;
			});
		},

		client: function() {
		}
	},

	craftOpen: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, click the craft button');
			// Show the tooltip
			ige.hud.leftToolbar.windows.craftingUI.button.tooltipster('show');
			var listener = ige.on('cosmos:CraftingUIComponent.buttonClicked', function (classId) {
				alertify.questLog('Good! You\'ve opened crafting!', 'success', 5000);
				ige.off('cosmos:CraftingUIComponent.buttonClicked', listener);
				close();
				// Show the tooltip
				ige.hud.leftToolbar.windows.craftingUI.button.tooltipster('hide');
				//self.questState = self.craft;
			});
		},

		client: function() {
		}

	},

	craftEngine: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, let's craft an Iron Engine');
			// Show the tooltip
			ige.hud.leftToolbar.windows.craftingUI.button.tooltipster('show');
			var listener = ige.on('cosmos:CraftingUIComponent.buttonClicked', function (classId) {
				alertify.questLog('Good! You\'ve opened crafting!', 'success', 5000);
				ige.off('cosmos:CraftingUIComponent.buttonClicked', listener);
				close();
				// Show the tooltip
				ige.hud.leftToolbar.windows.craftingUI.button.tooltipster('hide');
				//self.questState = self.craft;
			});
		},

		client: function() {
		}

	}

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
