var TutorialQuest = Quest.extend({
	classId: 'TutorialQuest',


	init: function(instance) {
		Quest.prototype.init.call(this, instance);

		if (ige.isClient) {
			this.questState = this.complete;
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
			var removeQuestLog = alertify.questLog(message, '', 5000);
			//ige.questSystem.eventToServer(this.keys['welcome.action'], this);
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
			var removeQuestLog = alertify.questLog('Now, move forward by pressing the W key');
			var listener = ige.input.on('keyDown', function (event, keyCode) {
				if (keyCode === ige.input.key.w) {
					removeQuestLog();
					ige.input.off('keyDown', listener);
					alertify.questLog('Good! You\'ve moved forward!', 'success', 5000);
					self.questState = self.mine;
				}
			});
		},

		client: function() {
		}
	},

	// TODO: Add a tooltip
	mine: {
		once: function() {
			var self = this;
			var removeQuestLog = alertify.questLog('Now, mine a block');
			var listener = ige.on('cosmos:block.mousedown', function () {
				removeQuestLog();
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
			var removeQuestLog = alertify.questLog('Now, click the cargo button');
			// Show the tooltip
			ige.hud.leftToolbar.windows.cargo.showButtonTooltip();
			var listener = ige.on('cosmos:CargoComponent.buttonClicked', function (classId) {
				removeQuestLog();
				ige.off('cosmos:CargoComponent.buttonClicked', listener);
				// Hide the tooltip
				ige.hud.leftToolbar.windows.cargo.hideButtonTooltip();
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
			var removeQuestLog = alertify.questLog('Now, click the craft button');
			// Show the tooltip
			ige.hud.leftToolbar.windows.craftingUI.showButtonTooltip();
			var listener = ige.on('cosmos:CraftingUIComponent.buttonClicked', function (classId) {
				removeQuestLog();
				ige.off('cosmos:CraftingUIComponent.buttonClicked', listener);
				// Hide the tooltip
				ige.hud.leftToolbar.windows.craftingUI.hideButtonTooltip();
				alertify.questLog('Good! You\'ve opened crafting!', 'success', 5000);
				self.questState = self.craftBlock;
			});
		},

		client: function() {
		}

	},

	craftBlock: {
		once: function() {
			var self = this;
			// Here, we choose an Iron Engine to craft
			var block = cosmos.blocks.instances["IronEngineBlock"];
			var recipeName = block.classId();
			var recipeNameHuman = block.recipe.name;
			var removeQuestLog = alertify.questLog('Now, let\'s craft one ' + recipeNameHuman);
			// Show the crafting tooltip for the desired block
			ige.hud.leftToolbar.windows.craftingUI.showRecipeTooltip(recipeName);
			var listener = ige.craftingSystem.on('cosmos:CraftingSystem.craft.success', 
				function (serverRecipeName) {
				if (serverRecipeName === recipeName) {
					removeQuestLog();
					ige.hud.leftToolbar.windows.craftingUI.hideRecipeTooltip(recipeName);
					ige.craftingSystem.off('cosmos:CraftingSystem.craft.success', listener);
					alertify.questLog('Good! You\'ve crafted one ' + recipeNameHuman + '!', 'success', 5000);
					self.questState = self.construct;
				}
			});
		},

		client: function() {
		}

	},

	// Construct something on the player ship
	construct: {
		once: function() {
			var self = this;
			alertify.questLog('Now, let\'s add something to your ship', '', 5000);
			clickConstruct();

			function clickConstruct() {
				// Make the player click the construct button
				var removeQuestLog = alertify.questLog('Click the construct button');
				// Show the tooltip for the construct button
				ige.hud.bottomToolbar.capBar.constructCap.showButtonTooltip();
				var listener = ige.on('capbar cap selected', function (classId) {
					if (classId === ConstructCap.prototype.classId()) {
						removeQuestLog();
						ige.off('capbar cap selected', listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.constructCap.hideButtonTooltip();
						constructShip();
					}
				});
			}

			function constructShip() {
				// Make the player construct a block on the ship
				var removeQuestLog = alertify.questLog('Now, click on the construction zones around your ship.');
				var listener = ige.on('cosmos:BlockGrid.processBlockActionClient.add', 
					function (selectedType, blockGrid) {
					if (blockGrid === ige.client.player) {
						removeQuestLog();
						ige.hud.bottomToolbar.capBar.constructCap.hideButtonTooltip();
						ige.craftingSystem.off('cosmos:BlockGrid.processBlockActionClient.add', listener);
						alertify.questLog('Good! You\'ve constructed a block on your ship!', 'success', 5000);
						self.questState = self.chat;
					}
				});
			}
		},


		client: function() {
		}


	},

	// TODO: Skip this if chat is already visible
	chat: {
		once: function() {
			var self = this;
			var removeQuestLog = alertify.questLog('Now, click the chat button');
			// Show the tooltip
			ige.hud.bottomToolbar.chat.showButtonTooltip();
			var listener = ige.hud.bottomToolbar.chat.on('cosmos:ChatComponent.show', function () {
				removeQuestLog();
				ige.hud.bottomToolbar.chat.off('cosmos:ChatComponent.show', listener);
				// Hide the tooltip
				ige.hud.bottomToolbar.chat.hideButtonTooltip();
				alertify.questLog('Good! You\'ve opened the chat!', 'success', 5000);
				self.questState = self.relocate;
			});
		},

		client: function() {
		}
	},

	relocate: {
		once: function() {
			var self = this;
			var removeQuestLog = alertify.questLog('Now, click the relocate button');
			// Show the tooltip
			ige.hud.bottomToolbar.relocate.showButtonTooltip();
			var listener = ige.hud.bottomToolbar.relocate.on('cosmos:RelocateComponent.mouseDown', function () {
				removeQuestLog();
				ige.hud.bottomToolbar.relocate.off('cosmos:RelocateComponent.mouseDown', listener);
				// Hide the tooltip
				ige.hud.bottomToolbar.relocate.hideButtonTooltip();
				alertify.questLog('Good! You\'ve clicked the relocate button!', 'success', 5000);
				//self.questState = self.relocate;
			});
		},

		client: function() {
		}
	},


	complete: {
		once: function() {
		},
		client: function() {
		},
		server: function() {
			//Remove quest
		}
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = TutorialQuest; }
