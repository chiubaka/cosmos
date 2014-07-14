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
					close();
					ige.input.off('keyDown', listener);
					alertify.questLog('Good! You\'ve moved forward!', 'success', 5000);
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
				close();
				ige.off('cosmos:block.mousedown', listener);
				alertify.questLog('Good! You\'ve mined a block!', 'success', 5000);
				self.questState = self.cargo;
			});
		},

		client: function() {
		},

		server: function() {
		}
	},

	// TODO: Skip this if the cargo window is already open
	cargo: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, click the cargo button');
			// Show the tooltip
			ige.hud.leftToolbar.windows.cargo.button.tooltipster('show');
			var listener = ige.on('cosmos:CargoComponent.buttonClicked', function (classId) {
				close();
				ige.off('cosmos:CargoComponent.buttonClicked', listener);
				// Hide the tooltip
				ige.hud.leftToolbar.windows.cargo.button.tooltipster('hide');
				alertify.questLog('Good! You\'ve opened the cargo!', 'success', 5000);
				self.questState = self.craftOpen;
			});
		},

		client: function() {
		}
	},

	// TODO: Skip this if the crafting window is already open
	craftOpen: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, click the craft button');
			// Show the tooltip
			ige.hud.leftToolbar.windows.craftingUI.button.tooltipster('show');
			var listener = ige.on('cosmos:CraftingUIComponent.buttonClicked', function (classId) {
				close();
				ige.off('cosmos:CraftingUIComponent.buttonClicked', listener);
				// Hide the tooltip
				ige.hud.leftToolbar.windows.craftingUI.button.tooltipster('hide');
				alertify.questLog('Good! You\'ve opened crafting!', 'success', 5000);
				self.questState = self.craftEngine;
			});
		},

		client: function() {
		}

	},

	craftEngine: {
		once: function() {
			var self = this;
			var close = alertify.questLog('Now, let\'s craft an Iron Engine');
			// Show the tooltip for the Iron Engine recipe
			var recipeName = IronEngineBlock.prototype.classId();
			var recipeDOMElement = ige.hud.leftToolbar.windows.craftingUI.recipeDOMElements[recipeName];
			recipeDOMElement.tooltipster('show');
			var listener = ige.craftingSystem.on('cosmos:CraftingSystem.craft.success', 
				function (serverRecipeName) {
				if (serverRecipeName === recipeName) {
					close();
					recipeDOMElement.tooltipster('hide');
					ige.craftingSystem.off('cosmos:CraftingSystem.craft.success', listener);
					alertify.questLog('Good! You\'ve crafted an Iron Engine!', 'success', 5000);
					//self.questState = self.craft;
				}
			});
		},

		client: function() {
		}

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
