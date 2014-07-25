var TutorialQuest = Quest.extend({
	classId: 'TutorialQuest',


	init: function(instance) {
		Quest.prototype.init.call(this, instance);

		if (ige.isClient) {
			this.questState = this.welcome;
		}

		if (ige.isServer) {
			this.on(this.keys['complete'], this.complete.server, this);
		}
	},

	// Map messages to numbers to reduce bandwidth
	// This is important when quests require heavy client-server interaction
	keys: {
		// The client sends a 'complete' message to the server when this quest is
		// completed
		'complete': '1',
	},

	welcome: {
		clientOnce: function() {
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

		},

		clientStep: function() {

		},
	},

	moveForward: {
		clientOnce: function () {
			var self = this;
			var msgTimeout = 2000;

			pressW();

			function pressW() {
				var questLog = alertify.questLog('Press W to move forward');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.w) {
						questLog.close();
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

		clientStep: function() {
		}
	},

	moveBackwards: {
		clientOnce: function () {
			var self = this;
			var msgTimeout = 2000;

			pressS();

			function pressS() {
				var questLog = alertify.questLog('Press S to move backward');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.s) {
						questLog.close();
						ige.input.off('keyDown', listener);
						alertify.questLog('Great! You\'ve moved backward!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.rotateLeft;
			}
		},

		clientStep: function() {
		}
	},

	rotateLeft: {
		clientOnce: function () {
			var self = this;
			var msgTimeout = 2000;

			pressA();

			function pressA() {
				var questLog = alertify.questLog('Press A to rotate left');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.a) {
						questLog.close();
						ige.input.off('keyDown', listener);
						alertify.questLog('Sweet! You\'ve rotated left!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.rotateRight;
			}
		},

		clientStep: function() {
		}
	},

	rotateRight: {
		clientOnce: function () {
			var self = this;
			var msgTimeout = 2000;

			pressD();

			function pressD() {
				var questLog = alertify.questLog('Press D to rotate right');
				var listener = ige.input.on('keyDown', function (event, keyCode) {
					if (keyCode === ige.input.key.d) {
						questLog.close();
						ige.input.off('keyDown', listener);
						alertify.questLog('Awesome! You\'ve rotated right!', 'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.moveAround;
			}
		},

		clientStep: function() {
		}
	},

	moveAround: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			flyingMessage();

			function flyingMessage() {
				var delay = 1000;
				var repetition = 10;
				var message = 'Let\'s fly around for a bit using the WASD controls!\n';
				var questLog = alertify.questLog(message);

				// Display a count down timer so players know the quest is advancing
				var countdown = repetition;
				var intervalId = setInterval(function(){
					questLog.DOMElement.innerText = message + ' ' + countdown;
					if (--countdown <= 0) {
						clearInterval(intervalId);
						questLog.close();
						doneFlying();
					}
				}, delay);
			}

			function doneFlying() {
				alertify.questLog('Nice! Let\'s try to use some capabilities!',
					'success', msgTimeout);
				setTimeout(done, msgTimeout / 2)
			}

			function done() {
				self.questState = self.mine;
			}
		},

		clientStep: function() {
		},

		server: function() {
		}
	},

	mine: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			clickMineButton();

			function clickMineButton() {
				var questLog = alertify.questLog('Click the mine button on the toolbar at the bottom of the screen');
				// Show the tooltip for the mine button
				ige.hud.bottomToolbar.capBar.mineCap.pinButtonTooltip();
				var listener = ige.on('capbar cap selected', function (classId) {
					if (classId === MineCap.prototype.classId()) {
						questLog.close();
						ige.off('capbar cap selected', listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.mineCap.unpinButtonTooltip();
						mineBlock();
					}
				});
			}

			function mineBlock() {
				var questLog = alertify.questLog('Now, click on an asteroid and mine it');
				var listener = ige.on('cosmos:block.mousedown', function () {
					questLog.close();
					ige.off('cosmos:block.mousedown', listener);
					alertify.questLog('Magnificent! You\'ve mined a block!', 'success', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.cargo;
			}
		},

		clientStep: function() {
		},

		server: function() {
		}
	},

	// TODO: Skip this if the cargo window is already open
	cargo: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			clickCargoButton();

			function clickCargoButton() {
				var questLog = alertify.questLog('Now, click the cargo button on the toolbar at the left side of the screen');
				// Show the tooltip
				ige.hud.leftToolbar.windows.cargo.pinButtonTooltip();
				var listener = ige.on('cosmos:CargoComponent.buttonClicked', function (classId) {
					questLog.close();
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

		clientStep: function() {
		}
	},

	// TODO: Skip this if the crafting window is already open
	craft: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			// Here, we choose an Iron Engine to craft
			var block = cosmos.blocks.instances["IronEngineBlock"];
			var recipeName = block.classId();
			var recipeNameHuman = block.recipe.name;
			var reactants = block.recipe.reactants;

			clickCraftButton();

			function clickCraftButton() {
				var questLog = alertify.questLog('Click the crafting button');
				// Show the tooltip
				ige.hud.leftToolbar.windows.craftingUI.pinButtonTooltip();
				var listener = ige.on('cosmos:CraftingUIComponent.buttonClicked', function (classId) {
					questLog.close();
					ige.off('cosmos:CraftingUIComponent.buttonClicked', listener);
					// Hide the tooltip
					ige.hud.leftToolbar.windows.craftingUI.unpinButtonTooltip();
					alertify.questLog('Crafting allows you to make powerful new blocks',
						'', msgTimeout);
					setTimeout(waitForReactants, msgTimeout / 2);
				});
			}

			function waitForReactants() {
				var baseMessage = 'Now, let\'s craft an ' + recipeNameHuman + '. ';
				var questLog = alertify.questLog(baseMessage);
				// Show the crafting tooltip for the desired block
				ige.hud.leftToolbar.windows.craftingUI.pinRecipeTooltip(recipeName);

				// Inform the player what they need to collect
				var responseListener = ige.on('cargo response', checkForReactants, this);
				var updateListener = ige.on('cargo update', checkForReactants, this);
				checkForReactants(ige.hud.leftToolbar.windows.cargo.cargoItems);

				function checkForReactants(cargoItems) {
					var collectionMessage = 'You\'ll need the following resources in addition to the resources already in your cargo:';
					var canCraft = true;
					// Go through each of the recipe's reactants and see if we have
					// enough in our cargo
					for (var i = 0; i < reactants.length; i++) {
						var blockType = reactants[i].blockType;
						var quantityNeeded = reactants[i].quantity;
						var quantityHave = 0;
						if (cargoItems.hasOwnProperty(blockType)) {
							quantityHave = cargoItems[blockType];
						}
						var quantityToCollect = quantityNeeded - quantityHave;
						if (quantityToCollect > 0) {
							canCraft = false;
						}
						collectionMessage += '<br />' + Math.max(0, quantityToCollect) + ' ' +
							Block.displayNameFromClassId(blockType);
					}
					questLog.DOMElement.innerHTML = baseMessage + collectionMessage;

					if (canCraft) {
						questLog.close();
						ige.off('cargo response', responseListener);
						ige.off('cargo update', updateListener);
						alertify.questLog('Bravo! You\'ve collected all necessary blocks!',
							'success', msgTimeout);
						setTimeout(craftBlock, msgTimeout / 2);
					}
				}
			}

			function craftBlock() {
				var questLog = alertify.questLog('Now, click the ' + recipeNameHuman +
					' recipe in the crafting window');

				ige.hud.leftToolbar.windows.craftingUI.pinRecipeTooltip(recipeName);
				var listener = ige.craftingSystem.on('cosmos:CraftingSystem.craft.success',
					function (serverRecipeName) {
					if (serverRecipeName === recipeName) {
						questLog.close();
						ige.hud.leftToolbar.windows.craftingUI.unpinRecipeTooltip(recipeName);
						ige.craftingSystem.off('cosmos:CraftingSystem.craft.success', listener);
						alertify.questLog('Woohoo! You\'ve crafted one ' + recipeNameHuman + '!',
							'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.construct;
			}
		},

		clientStep: function() {
		}

	},

	// Construct something on the player ship
	construct: {
		clientOnce: function() {
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
				var questLog = alertify.questLog('Click the construct button');
				// Show the tooltip for the construct button
				ige.hud.bottomToolbar.capBar.constructCap.pinButtonTooltip();
				var listener = ige.on('capbar cap selected', function (classId) {
					if (classId === ConstructCap.prototype.classId()) {
						questLog.close();
						ige.off('capbar cap selected', listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.constructCap.unpinButtonTooltip();
						constructShip();
					}
				});
			}

			function constructShip() {
				// Make the player construct a block on the ship
				var questLog = alertify.questLog('Now, click on the construction zones around your ship.');
				var listener = ige.on('cosmos:BlockGrid.processBlockActionClient.add',
					function (selectedType, blockGrid) {
					if (blockGrid === ige.client.player.currentShip()) {
						questLog.close();
						ige.off('cosmos:BlockGrid.processBlockActionClient.add', listener);
						alertify.questLog('Wow! You\'ve constructed a block on your ship!',
							'success', msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				self.questState = self.chat;
			}
		},


		clientStep: function() {
		}


	},

	// TODO: Skip this if chat is already visible
	chat: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			clickChat();

			function clickChat() {
				var questLog = alertify.questLog('Now, click the chat button');
				// Show the tooltip
				ige.hud.bottomToolbar.chat.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.chat.on('cosmos:ChatComponent.show', function () {
					questLog.close();
					ige.hud.bottomToolbar.chat.off('cosmos:ChatComponent.show', listener);
					// Hide the tooltip
					ige.hud.bottomToolbar.chat.unpinButtonTooltip();
					alertify.questLog('Incredible! You\'ve opened the chat!\nYou can use the chat to talk with other players at any time.', 'success',
						msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.relocate;
			}

		},

		clientStep: function() {
		}
	},

	relocate: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			relocateMessage();

			function relocateMessage() {
				var message = 'If you\'re ever stuck, the relocate button warps you to another place';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(clickRelocate, msgTimeout / 2);
			}

			function clickRelocate() {
				var questLog = alertify.questLog('Click the relocate button');
				// Show the tooltip
				ige.hud.bottomToolbar.relocate.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.relocate.on('cosmos:RelocateComponent.mouseDown', function () {
					questLog.close();
					ige.hud.bottomToolbar.relocate.off('cosmos:RelocateComponent.mouseDown', listener);
					// Hide the tooltip
					ige.hud.bottomToolbar.relocate.unpinButtonTooltip();
					alertify.questLog('Good job. You\'ve clicked the relocate button!',
						'success', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				self.questState = self.newShip;
			}
		},

		clientStep: function() {
		}
	},

	newShip: {
		clientOnce: function() {
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

		clientStep: function() {
		}
	},

	feedback: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			feedbackMessage();

			function feedbackMessage() {
				var message = 'Your feedback is very important to us! We\'d love to get your thoughts!';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(clickFeedback, msgTimeout / 2);
			}

			function clickFeedback() {
				var questLog = alertify.questLog('Click the feedback button');
				// Show the tooltip
				ige.hud.bottomToolbar.feedback.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.feedback.on('cosmos:FeedbackComponent.clicked', function () {
					questLog.close();
					// Hide the tooltip
					ige.hud.bottomToolbar.feedback.unpinButtonTooltip();
					alertify.questLog('Great! Feel free to leave us some feedback.', 'success',
						msgTimeout);
					setTimeout(done, msgTimeout / 2);
				}, self, true);
			}

			function done() {
				self.questState = self.complete;
			}
		},

		clientStep: function() {
		}
	},



	complete: {
		clientOnce: function() {
			var msgTimeout = 5000;
			var message = 'Congratulations! You\'ve completed the tutorial. Your galaxy awaits!';
			alertify.questLog(message, 'success', msgTimeout);
			ige.questSystem.eventToServer(this.keys['complete'], this);
			ige.client.metrics.emit('cosmos:quest.tutorialQuest.completed');
		},
		clientStep: function() {
		},
		// @server-side
		server: function(player) {
			// For now, don't do any server side verification that the client has
			// completed the quest
			ige.questSystem.removeQuestServer(this, player);
		}
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = TutorialQuest; }