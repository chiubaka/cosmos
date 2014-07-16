var TutorialQuest = Quest.extend({
	classId: 'TutorialQuest',


	init: function(instance) {
		Quest.prototype.init.call(this, instance);

		if (ige.isClient) {
			this.questState = this.cargo;
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
			var msgTimeout = 5000;

			welcomeMessage();

			function welcomeMessage() {
				var message = 'Welcome to Cosmos!';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(tutorialMessage, msgTimeout / 2);
			}

			function tutorialMessage() {
				var message = 'Let\'s get familiar with the controls, the WASD keys';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(done, msgTimeout / 2);
			}

			function done() {
				self.questState = self.moveForward;
			}

			//ige.questSystem.eventToServer(this.keys['welcome.action'], this);
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
			var msgTimeout = 2000;

			pressW();

			function pressW() {
				var removeQuestLog = alertify.questLog('Press W to move forward');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.w) {
						removeQuestLog();
						ige.input.off('keyDown', listener);
						alertify.questLog('Good! You\'ve moved forward!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.moveBackwards;
			}
		},

		client: function() {
		}
	},

	moveBackwards: {
		once: function () {
			var self = this;
			var msgTimeout = 2000;

			pressS();

			function pressS() {
				var removeQuestLog = alertify.questLog('Press S to move backward');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.s) {
						removeQuestLog();
						ige.input.off('keyDown', listener);
						alertify.questLog('Good! You\'ve moved backward!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.rotateLeft;
			}
		},

		client: function() {
		}
	},

	rotateLeft: {
		once: function () {
			var self = this;
			var msgTimeout = 2000;

			pressA();

			function pressA() {
				var removeQuestLog = alertify.questLog('Press A to rotate left');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.a) {
						removeQuestLog();
						ige.input.off('keyDown', listener);
						alertify.questLog('Good! You\'ve rotated left!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.rotateRight;
			}
		},

		client: function() {
		}
	},

	rotateRight: {
		once: function () {
			var self = this;
			var msgTimeout = 2000;

			pressD();

			function pressD() {
				var removeQuestLog = alertify.questLog('Press D to rotate right');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.d) {
						removeQuestLog();
						ige.input.off('keyDown', listener);
						alertify.questLog('Good! You\'ve rotated right!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.moveAround;
			}
		},

		client: function() {
		}
	},

	moveAround: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;
			var flyingTime = 10000;

			var removeQuestLog = alertify.questLog('Let\'s fly around for a bit using the WASD controls!');
			setTimeout(doneFlying, flyingTime);

			function doneFlying() {
				removeQuestLog();
				alertify.questLog('Great! Let\'s try to use some capabilities!',
					'success', msgTimeout);
				setTimeout(done, msgTimeout / 2)
			}

			function done() {
				self.questState = self.mine;
			}
		},

		client: function() {
		},

		server: function() {
		}
	},

	mine: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			clickMineButton();

			function clickMineButton() {
				var removeQuestLog = alertify.questLog('Click the mine button');
				// Show the tooltip for the mine button
				ige.hud.bottomToolbar.capBar.mineCap.pinButtonTooltip();
				var listener = ige.on('capbar cap selected', function (classId) {
					if (classId === MineCap.prototype.classId()) {
						removeQuestLog();
						ige.off('capbar cap selected', listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.mineCap.unpinButtonTooltip();
						mineBlock();
					}
				});
			}

			function mineBlock() {
				var removeQuestLog = alertify.questLog('Now, click on an asteroid and mine it');
				var listener = ige.on('cosmos:block.mousedown', function () {
					removeQuestLog();
					ige.off('cosmos:block.mousedown', listener);
					alertify.questLog('Good! You\'ve mined a block!', 'success', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.cargo;
			}
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
			var msgTimeout = 5000;

			clickCargoButton();

			function clickCargoButton() {
				var removeQuestLog = alertify.questLog('Now, click the cargo button');
				// Show the tooltip
				ige.hud.leftToolbar.windows.cargo.pinButtonTooltip();
				var listener = ige.on('cosmos:CargoComponent.buttonClicked', function (classId) {
					removeQuestLog();
					ige.off('cosmos:CargoComponent.buttonClicked', listener);
					// Hide the tooltip
					ige.hud.leftToolbar.windows.cargo.unpinButtonTooltip();
					alertify.questLog('Your cargo holds everything you\'ve mined',
						'', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.craft;
			}
		},

		client: function() {
		}
	},

	// TODO: Skip this if the crafting window is already open
	craft: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			clickCraftButton();

			function clickCraftButton() {
				var removeQuestLog = alertify.questLog('Click the crafting button');
				// Show the tooltip
				ige.hud.leftToolbar.windows.craftingUI.pinButtonTooltip();
				var listener = ige.on('cosmos:CraftingUIComponent.buttonClicked', function (classId) {
					removeQuestLog();
					ige.off('cosmos:CraftingUIComponent.buttonClicked', listener);
					// Hide the tooltip
					ige.hud.leftToolbar.windows.craftingUI.unpinButtonTooltip();
					alertify.questLog('Crafting allows you to make powerful new blocks',
						'', msgTimeout);
					setTimeout(craftBlock, msgTimeout / 2);
				});
			}

			function craftBlock() {
				// Here, we choose an Iron Engine to craft
				var block = cosmos.blocks.instances["IronEngineBlock"];
				var recipeName = block.classId();
				var recipeNameHuman = block.recipe.name;
				var removeQuestLog = alertify.questLog('Now, let\'s craft one ' + recipeNameHuman);
				// Show the crafting tooltip for the desired block
				ige.hud.leftToolbar.windows.craftingUI.pinRecipeTooltip(recipeName);
				var listener = ige.craftingSystem.on('cosmos:CraftingSystem.craft.success', 
					function (serverRecipeName) {
					if (serverRecipeName === recipeName) {
						removeQuestLog();
						ige.hud.leftToolbar.windows.craftingUI.unpinRecipeTooltip(recipeName);
						ige.craftingSystem.off('cosmos:CraftingSystem.craft.success', listener);
						alertify.questLog('Good! You\'ve crafted one ' + recipeNameHuman + '!',
							'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.construct;
			}
		},

		client: function() {
		}

	},

	// Construct something on the player ship
	construct: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			constructMessage();

			function constructMessage() {
				var message = 'Now, let\'s add something to your ship';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(clickConstruct, msgTimeout / 2);
			}

			function clickConstruct() {
				// Make the player click the construct button
				var removeQuestLog = alertify.questLog('Click the construct button');
				// Show the tooltip for the construct button
				ige.hud.bottomToolbar.capBar.constructCap.pinButtonTooltip();
				var listener = ige.on('capbar cap selected', function (classId) {
					if (classId === ConstructCap.prototype.classId()) {
						removeQuestLog();
						ige.off('capbar cap selected', listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.constructCap.unpinButtonTooltip();
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
						ige.craftingSystem.off('cosmos:BlockGrid.processBlockActionClient.add', listener);
						alertify.questLog('Good! You\'ve constructed a block on your ship!',
							'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.chat;
			}
		},


		client: function() {
		}


	},

	// TODO: Skip this if chat is already visible
	chat: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			clickChat();

			function clickChat() {
				var removeQuestLog = alertify.questLog('Now, click the chat button');
				// Show the tooltip
				ige.hud.bottomToolbar.chat.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.chat.on('cosmos:ChatComponent.show', function () {
					removeQuestLog();
					ige.hud.bottomToolbar.chat.off('cosmos:ChatComponent.show', listener);
					// Hide the tooltip
					ige.hud.bottomToolbar.chat.unpinButtonTooltip();
					alertify.questLog('Good! You\'ve opened the chat!', 'success',
						msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.relocate;
			}

		},

		client: function() {
		}
	},

	relocate: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			relocateMessage();

			function relocateMessage() {
				var message = 'If you\'re ever stuck, the relocate button warps you to another place';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(clickRelocate, msgTimeout / 2);
			}

			function clickRelocate() {
				var removeQuestLog = alertify.questLog('Click the relocate button');
				// Show the tooltip
				ige.hud.bottomToolbar.relocate.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.relocate.on('cosmos:RelocateComponent.mouseDown', function () {
					removeQuestLog();
					ige.hud.bottomToolbar.relocate.off('cosmos:RelocateComponent.mouseDown', listener);
					// Hide the tooltip
					ige.hud.bottomToolbar.relocate.unpinButtonTooltip();
					alertify.questLog('Good! You\'ve clicked the relocate button!',
						'success', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.newShip;
			}
		},

		client: function() {
		}
	},

	newShip: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			newShipMessage();

			function newShipMessage() {
				var message = 'If you are disabled, the new ship button gives you another ship';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(pinNewShipTooltip, msgTimeout / 2);
			}

			function pinNewShipTooltip() {
				alertify.questLog('Click the new ship button (optional)', '', msgTimeout);
				// Show the tooltip
				ige.hud.bottomToolbar.newShip.pinButtonTooltip();
				setTimeout(unpinNewShipTooltip, msgTimeout);
			}

			function unpinNewShipTooltip() {
				// Hide the tooltip
				ige.hud.bottomToolbar.newShip.unpinButtonTooltip();
				done();
			}

			function done() {
				self.questState = self.feedback;
			}
		},

		client: function() {
		}
	},

	feedback: {
		once: function() {
			var self = this;
			var msgTimeout = 5000;

			feedbackMessage();

			function feedbackMessage() {
				var message = 'Your feedback is very important to us! We\'d love to get your thoughts!';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(clickFeedback, msgTimeout / 2);
			}

			function clickFeedback() {
				var removeQuestLog = alertify.questLog('Click the feedback button');
				// Show the tooltip
				ige.hud.bottomToolbar.feedback.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.feedback.on('cosmos:FeedbackComponent.clicked', function () {
					removeQuestLog();
					// Hide the tooltip
					ige.hud.bottomToolbar.feedback.unpinButtonTooltip();
					alertify.questLog('Great! You\'ve clicked the feedback button!', 'success',
						msgTimeout);
					setTimeout(done, msgTimeout / 2);
				}, self, true);
			}

			function done() {
				self.questState = self.complete;
			}
		},

		client: function() {
		}
	},



	complete: {
		once: function() {
			var msgTimeout = 5000;
			var message = 'Congratulations! You\'ve completed the tutorial. Your galaxy awaits!';
			alertify.questLog(message, 'success', msgTimeout);

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
