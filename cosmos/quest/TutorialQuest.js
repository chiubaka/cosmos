var TutorialQuest = Quest.extend({
	classId: "TutorialQuest",

	init: function(instance) {
		Quest.prototype.init.call(this, instance);

		if (ige.isClient) {
			this.questState = this.welcome;
		}

		if (ige.isServer) {
			this.on(this.keys['mine'], this.mine.server, this);
			this.on(this.keys['collect'], this.collect.server, this);
			this.on(this.keys['complete'], this.complete.server, this);
		}
	},

	// Map messages to numbers to reduce bandwidth
	// This is important when quests require heavy client-server interaction
	// NOTE: values must be strings to work with IGE event system
	keys: {
		'mine': "1",
		'collect': "2",
		// The client sends a 'complete' message to the server when this quest is
		// completed
		'complete': "3",
	},

	welcome: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			welcomeMessage();

			function welcomeMessage() {
				var message = 'Welcome to Cosmos!';
				alertify.questLog(message, "", msgTimeout);
				setTimeout(tutorialMessage, msgTimeout / 2);
			}

			function tutorialMessage() {
				var message = "Let's get familiar with the controls, the WASD keys";
				alertify.questLog(message, "", msgTimeout);
				setTimeout(done, msgTimeout / 2);
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.welcome.completed");
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
				var questLog = alertify.questLog("Press W to move forward");
				var listener = ige.input.on("keyDown", function (event, keyCode) {
					if (keyCode === ige.input.key.w) {
						questLog.close();
						ige.input.off("keyDown", listener);
						alertify.questLog("Good! You\'ve moved forward!", "success", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.moveForward.completed");
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
				var questLog = alertify.questLog("Press S to move backward");
				var listener = ige.input.on("keyDown", function (event, keyCode) {
					if (keyCode === ige.input.key.s) {
						questLog.close();
						ige.input.off("keyDown", listener);
						alertify.questLog("Great! You\'ve moved backward!", "success", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.moveBackwards.completed");
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
				var questLog = alertify.questLog("Press A to rotate left");
				var listener = ige.input.on("keyDown", function (event, keyCode) {
					if (keyCode === ige.input.key.a) {
						questLog.close();
						ige.input.off("keyDown", listener);
						alertify.questLog("Sweet! You\'ve rotated left!", "success", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.rotateLeft.completed");
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
				var questLog = alertify.questLog("Press D to rotate right");
				var listener = ige.input.on("keyDown", function (event, keyCode) {
					if (keyCode === ige.input.key.d) {
						questLog.close();
						ige.input.off("keyDown", listener);
						alertify.questLog("Awesome! You\'ve rotated right!", "success", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.rotateRight.completed");
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
				alertify.questLog("Nice! Let's look at the minimap!",
					"success", msgTimeout);
				setTimeout(done, msgTimeout / 2);
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.moveAround.completed");
				self.questState = self.minimap;
			}
		},

		clientStep: function() {
		},

		server: function() {
		}
	},

	minimap: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 10000;

			minimapWelcome();

			function minimapWelcome() {
				ige.hud.minimap.addGlow();
				var message = "The mini-map is located near the lower right corner." + "<br>" +
					"It allows you to see more of the world.";
				alertify.questLog(message, '', msgTimeout);
				setTimeout(minimapExplain, msgTimeout / 2);
			}

			function minimapExplain() {
				var message = '<font style="color:#00ff00;"> You show up as green</font><br>' +
					'<font style="color:#ff0000;"> Other players show up as red</font><br>' +
					'<font style="color:#808080;"> Neutral objects show up as gray</font>';
				alertify.questLog(message, '', msgTimeout);
				setTimeout(minimapDone, msgTimeout / 2);
			}

			function minimapDone() {
				ige.hud.minimap.removeGlow();
				alertify.questLog("Let's try out some capabilities!",
					'success', 5000);
				setTimeout(done, 5000 / 2);
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.minimap.completed");
				self.questState = self.mine;
			}
		}

	},

	mine: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			clickMineButton();

			function clickMineButton() {
				var questLog = alertify.questLog("Click the mine button on the toolbar at the bottom of the screen");
				// Show the tooltip for the mine button
				ige.hud.bottomToolbar.capBar.mineCap.pinButtonTooltip();
				var listener = ige.on("capbar cap selected", function (classId) {
					if (classId === MineCap.prototype.classId()) {
						questLog.close();
						ige.off("capbar cap selected", listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.mineCap.unpinButtonTooltip();
						mineBlock();
					}
				});
			}

			function mineBlock() {
				var questLog = alertify.questLog("Now, click on an asteroid to mine it");
				// First, set up listeners
				self.on(self.keys['collect'], function() { // Listen for block collection
					self.collect.collected = true;
				}, self, true);

				self.on(self.keys['mine'], function() { // Listen for block mined
					questLog.close();
					alertify.questLog("Magnificent! You've mined a block!", 'success', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				}, self, true);

				// Then, ask the server
				ige.questSystem.eventToServer(self.keys['collect'], self);
				ige.questSystem.eventToServer(self.keys['mine'], self);
			}


			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.mine.completed");
				self.questState = self.collect;
			}
		},

		clientStep: function() {
		},

		// Tells the client that a block has been mined
		// @server-side
		server: function(player) {
			player.on('cosmos:Element.onDeath.newDrop', function(drop) {
				ige.questSystem.eventToClient(this.keys['mine'], this, player.clientId());
			}, this, true);
		}
	},

	collect: {
		// Indicates if a block has been collected
		collected: false,

		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			// If a block is already collected, don't tell player to collect the block
			if (this.collect.collected) {
				alertify.questLog("Glorious! You've collected a block! You will " +
					"automatically collect blocks near you.", 'success', msgTimeout);
				setTimeout(done, msgTimeout / 2);
			}
			else {
				collectBlock();
			}

			function collectBlock() {
				var questLog = alertify.questLog("Move your ship towards the dropped block to collect it.");
				// First, set up listener
				self.on(self.keys['collect'], function() {
					questLog.close();
					alertify.questLog("Glorious! You've collected a block!", 'success', msgTimeout);
					setTimeout(done, msgTimeout / 2);
				}, self, true);
				// Then, ask the server if we have collected a drop
				ige.questSystem.eventToServer(self.keys['collect'], self);
			}


			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.collect.completed");
				self.questState = self.cargo;
			}
		},

		clientStep: function() {
		},

		// Tells the client that a drop has been collected
		// @server-side
		server: function(player) {
			player.on('cosmos:Ship.blockCollected', function(drop) {
				ige.questSystem.eventToClient(this.keys['collect'], this, player.clientId());
			}, this, true);
		}
	},

	// TODO: Skip this if the cargo window is already open
	cargo: {
		clientOnce: function() {
			var self = this;
			var msgTimeout = 5000;

			clickCargoButton();

			function clickCargoButton() {
				var questLog = alertify.questLog("To see what's in your cargo, click the cargo button on the toolbar at the left side of the screen");
				// Show the tooltip
				var cargoWindow = ige.hud.leftToolbar.windows.cargo;
				cargoWindow.pinButtonTooltip();
				var listener = cargoWindow.on("opened",
					function() {
						questLog.close();
						cargoWindow.off("opened", listener);
						cargoWindow.unpinButtonTooltip();
						alertify.questLog("Your cargo holds everything you've mined",
							"", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				);
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.cargo.completed");
				self.questState = self.craft;
			}
		},

		clientStep: function() {
		}
	},

	// TODO: Skip this if the crafting window is already open
	craft: {
		clientOnce: function() {
			var craftingWindow = ige.hud.leftToolbar.windows.craftingUI;
			var playerCargo = ige.client.player.currentShip().cargo;

			var self = this;
			var msgTimeout = 5000;

			// Here, we choose an Iron Engine to craft
			var block = cosmos.blocks.instances["IronEngineBlock"];
			var recipeName = block.classId();
			var recipeNameHuman = block.recipe.name;
			var reactants = block.recipe.reactants;

			clickCraftButton();

			function clickCraftButton() {
				var questLog = alertify.questLog("Click the crafting button");
				// Show the tooltip
				craftingWindow.pinButtonTooltip();
				var listener = craftingWindow.on("opened", function () {
					questLog.close();
					craftingWindow.off("opened", listener);
					// Hide the tooltip
					craftingWindow.unpinButtonTooltip();
					alertify.questLog("Crafting allows you to make powerful new blocks",
						"", msgTimeout);
					setTimeout(waitForReactants, msgTimeout / 2);
				});
			}

			function waitForReactants() {
				var baseMessage = "Now, let's craft an " + recipeNameHuman + ".";
				var questLog = alertify.questLog(baseMessage);
				// Show the crafting tooltip for the desired block
				craftingWindow.pinRecipeTooltip(recipeName);
				// Autohide the crafting tooltip so it doesn't get in the way
				setTimeout(function() {craftingWindow.unpinRecipeTooltip(
					recipeName)}, msgTimeout);

				var listener = craftingWindow.on("closed", function () {
					craftingWindow.unpinRecipeTooltip(recipeName);
					craftingWindow.off("closed", listener);
				});

				// Inform the player what they need to collect

				var cargoAddListener = playerCargo.on("add", updateReactantCounts,
					this);
				var cargoRemoveListener = playerCargo.on("remove", updateReactantCounts,
					this);
				updateReactantCounts();

				function updateReactantCounts() {
					var canCraft = true;
					var collectionMessage = "You'll need the following resources in " +
						"addition to the resources already in your cargo:";

					_.forEach(reactants, function (reactant) {
						var reactantType = reactant.blockType;
						var reactantQuantity = reactant.quantity;

						var numOwned = playerCargo.numItemsOfType(reactantType);
						var numRequired = Math.max(reactantQuantity - numOwned, 0);

						if (numRequired > 0) {
							canCraft = false;
							collectionMessage += "<br />" + numRequired + " "
								+ Block.displayNameFromClassId(reactantType);
						}
					});

					questLog.DOMElement.innerHTML = baseMessage + collectionMessage;

					if (canCraft) {
						questLog.close();
						playerCargo.off("add", cargoAddListener);
						playerCargo.off("remove", cargoRemoveListener);
						alertify.questLog("Bravo! You've collected all necessary blocks!",
							"success", msgTimeout);
						setTimeout(craftBlock, msgTimeout / 2);
					}
				}
			}

			function craftBlock() {
				var questLog = alertify.questLog("To craft the " + recipeNameHuman + ", click the " + recipeNameHuman +
					" recipe in the crafting window");

				craftingWindow.pinRecipeTooltip(recipeName);
				var listener = ige.craftingSystem.on("cosmos:CraftingSystem.craft.success",
					function (serverRecipeName) {
					if (serverRecipeName === recipeName) {
						questLog.close();
						craftingWindow.unpinRecipeTooltip(recipeName);
						ige.craftingSystem.off("cosmos:CraftingSystem.craft.success", listener);
						alertify.questLog("Woohoo! You've crafted one " + recipeNameHuman + "!",
							"success", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.craft.completed");
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
				var message = "Now, let's add something to your ship";
				alertify.questLog(message, "", msgTimeout);
				setTimeout(clickConstruct, msgTimeout / 2);
			}

			function clickConstruct() {
				// Make the player click the construct button
				var questLog = alertify.questLog("Click the construct button");
				// Show the tooltip for the construct button
				ige.hud.bottomToolbar.capBar.constructCap.pinButtonTooltip();
				var listener = ige.on("capbar cap selected", function (classId) {
					if (classId === ConstructCap.prototype.classId()) {
						questLog.close();
						ige.off("capbar cap selected", listener);
						// Hide the tooltip
						ige.hud.bottomToolbar.capBar.constructCap.unpinButtonTooltip();
						constructShip();
					}
				});
			}

			function constructShip() {
				// Make the player construct a block on the ship
				var questLog = alertify.questLog("Now, click on the construction zones around your ship.");
				var listener = ige.on("cosmos:BlockGrid.processActionClient.put",
					function (selectedType, blockGrid) {
					if (blockGrid === ige.client.player.currentShip()) {
						questLog.close();
						ige.off("cosmos:BlockGrid.processActionClient.put", listener);
						alertify.questLog("Wow! You've constructed a block on your ship!",
							"success", msgTimeout);
						setTimeout(done, msgTimeout / 2);
					}
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.construct.completed");
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
				var questLog = alertify.questLog("Now, click the chat button");
				// Show the tooltip
				ige.hud.bottomToolbar.chat.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.chat.on("cosmos:ChatComponent.show", function () {
					questLog.close();
					ige.hud.bottomToolbar.chat.off("cosmos:ChatComponent.show", listener);
					// Hide the tooltip
					ige.hud.bottomToolbar.chat.unpinButtonTooltip();
					alertify.questLog("You\'ve opened the chat!\nYou can use the chat to talk with other players at any time.", "success",
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
				alertify.questLog(message, "", msgTimeout);
				setTimeout(clickRelocate, msgTimeout / 2);
			}

			function clickRelocate() {
				var questLog = alertify.questLog("Click the relocate button on the toolbar in the lower right");
				// Show the tooltip
				ige.hud.bottomToolbar.relocate.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.relocate.on("cosmos:RelocateComponent.mouseDown", function () {
					questLog.close();
					ige.hud.bottomToolbar.relocate.off("cosmos:RelocateComponent.mouseDown", listener);
					// Hide the tooltip
					ige.hud.bottomToolbar.relocate.unpinButtonTooltip();
					alertify.questLog("Good job. You\'ve clicked the relocate button!",
						"success", msgTimeout);
					setTimeout(done, msgTimeout / 2);
				});
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.chat.completed");
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
				alertify.questLog(message, "", msgTimeout);
				setTimeout(pinNewShipTooltip, msgTimeout / 2);
			}

			function pinNewShipTooltip() {
				alertify.questLog("Click the new ship button (optional)", "", msgTimeout);
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
				alertify.questLog(message, "", msgTimeout);
				setTimeout(clickFeedback, msgTimeout / 2);
			}

			function clickFeedback() {
				var questLog = alertify.questLog("Click the feedback button");
				// Show the tooltip
				ige.hud.bottomToolbar.feedback.pinButtonTooltip();
				var listener = ige.hud.bottomToolbar.feedback.on("cosmos:FeedbackComponent.clicked", function () {
					questLog.close();
					// Hide the tooltip
					ige.hud.bottomToolbar.feedback.unpinButtonTooltip();
					alertify.questLog("Great! Feel free to leave us some feedback.", "success",
						msgTimeout);
					setTimeout(done, msgTimeout / 2);
				}, self, true);
			}

			function done() {
				ige.client.metrics.track("cosmos:quest.tutorialQuest.newShip.completed");
				self.questState = self.complete;
			}
		},

		clientStep: function() {
		}
	},



	complete: {
		clientOnce: function() {
			var msgTimeout = 5000;
			var message = "Congratulations! You've completed the tutorial. Your galaxy awaits!";
			alertify.questLog(message, "success", msgTimeout);
			ige.questSystem.eventToServer(this.keys['complete'], this);
			ige.client.metrics.track("cosmos:quest.tutorialQuest.completed");
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

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = TutorialQuest; }
