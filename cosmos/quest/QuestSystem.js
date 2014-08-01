var QuestSystem = IgeEventingClass.extend({
	classId: 'QuestSystem',
	componentId: 'questSystem',

	init: function() {
		if (ige.isServer) {
			ige.network.define('cosmos:quest.addQuest');
			ige.network.define('cosmos:quest.removeQuest');
			ige.network.define('cosmos:quest.eventToClient');
			ige.network.define('cosmos:quest.eventToServer', this._onEventToServer);
			// The client uses this to ask the server if it can start a quest
			ige.network.define('cosmos:quest.requestStartQuest', this._onRequestStartQuest);
		}
		if (ige.isClient) {
			ige.network.define('cosmos:quest.addQuest', this._addQuestClient);
			ige.network.define('cosmos:quest.removeQuest', this._removeQuestClient);
			ige.network.define('cosmos:quest.eventToClient', this._onEventToClient);
			ige.addBehaviour('questStepClient', this._questStepClient);
			// Show the tutorial for the guest user and the logged in guest user
			ige.on('cosmos:NamePrompt.hide', this._tutorialQuest, this, true);
			ige.on('cosmos:client.ship.streamed', this._tutorialQuest, this, true);
		}
		this.log('Quest system initiated');
	},

	/* Handles client attempts to start quests */
	// @server-side
	_onRequestStartQuest: function(data, clientId) {
		// Check if player exists
		var player = ige.server.players[clientId];
		if (player === undefined) {
			ige.questSystem.log('QuestSystem#_onRequestStartQuest: Player is undefined', 'warning');
			return;
		}
		var questName = data;

		// Verify player has unlocked this quest
		var unlockedQuests = player.quest.unlockedQuests();
		if (!unlockedQuests.hasOwnProperty(questName)) {
			ige.questSystem.log('QuestSystem#_onRequestStartQuest: Quest not unlocked', 'warning');
			return;
		}

		ige.questSystem.addQuestServer(questName, player);
	},

	// @server-side
	addQuestServer: function(questName, player) {
		// Get the next available instance number
		var instance = player.quest.getNextInstance(questName);
		player.quest.addQuest(questName, instance);
		var data = [questName, instance];
		ige.network.stream.queueCommand('cosmos:quest.addQuest', data, player.clientId());
	},

	// @client-side
	_addQuestClient: function(data) {
		var questName = data[0];
		var questInstance = data[1];
		ige.client.player.quest.addQuest(questName, questInstance);

		ige.questSystem.log('QuestSystem: Quest ' + questName + ' ' +
			questInstance + ' added!', 'info');
	},

	// @server-side
	removeQuestServer: function(quest, player) {
		var questName = quest.classId();
		var questInstance = quest.instance;
		delete player.quest.activeQuests()[questName][questInstance];

		// Delete quest client-side
		var data = [questName, questInstance];
		ige.network.stream.queueCommand('cosmos:quest.removeQuest', data, player.clientId());
	},

	// @client-side
	_removeQuestClient: function(data) {
		var questName = data[0];
		var questInstance = data[1];
		delete ige.client.player.quest.activeQuests()[questName][questInstance];

		ige.questSystem.log('QuestSystem: Quest ' + questName + ' ' +
			questInstance + ' removed!', 'info');
	},

	/* Sends a quest event to the server. */
	// @client-side
	eventToServer: function(event, quest) {
		var data = [quest.classId(), quest.instance, event]
		ige.network.send('cosmos:quest.eventToServer', data);
	},

	/* Receives a quest event from the client and emits it on the server's quest */
	// @server-side
	_onEventToServer: function(data, clientId) {
		// Check if player exists
		var player = ige.server.players[clientId];
		if (player === undefined) {
			ige.questSystem.log('QuestSystem#_onEventToServer: Player is undefined', 'warning');
			return;
		}
		var questName = data[0];
		var questInstance = data[1];
		var event = data[2];

		// Verify quest name
		var activeQuests = player.quest.activeQuests();
		if (!activeQuests.hasOwnProperty(questName)) {
			ige.questSystem.log('QuestSystem#_onEventToServer: Quest name not found', 'warning');
			return;
		}
		// Verify quest instance
		var instances = activeQuests[questName];
		if (!instances.hasOwnProperty(questInstance)) {
			ige.questSystem.log('QuestSystem#_onEventToServer: Quest instance not found', 'warning');
			return;
		}

		// Retrieve the specific quest
		var quest = instances[questInstance];

		// Emit an event on the quest
		quest.emit(event, [player]);
	},

	/* Sends an event to a quest on the client */
	// TODO: Build more functionality as needed when quests need more server
	// interaction
	// @server-side
	eventToClient: function(data, clientId) {
		ige.network.stream.queueCommand('cosmos:quest.eventToClient', data,
			clientId);
	},

	/* Receives an event from the server and emits it on the appropriate quest. */
	// @client-side
	_onEventToClient: function(data) {
		var questName = data[0];
		var questInstance = data[1];
		var event = data[2];

		// Retrieve the specific quest
		var quest = ige.client.player.quest.activeQuests()[questName][questInstance];

		// Emit an event on the quest
		quest.emit(event);
	},

	/* Loops over the player's active quests and runs their logic */
	// @client-side
	_questStepClient: function(ctx) {
		// Don't start until the player is streamed
		if (ige.client.player === undefined) {
			return;
		}

		var questComponent = ige.client.player.quest;
		var activeQuests = questComponent.activeQuests();
		// Loop over all quest names
		for (questName in activeQuests) {
			if (activeQuests.hasOwnProperty(questName)) {
				var instances = activeQuests[questName];
				// Loop over all instances of a quest name
				for (instance in instances) {
					if (instances.hasOwnProperty(instance)) {
						// Process behavior for that quest
						var quest = instances[instance];
						quest.processStep();
					}
				}
			}
		}
	},

	/**
	 * Runs when guest name window is hidden. Prompts the user if they want to
	 * start the tutorial quest
	 */
	// @client-side
	_tutorialQuest: function() {
		// TODO: This is sort of hacky. We want a unified way of showing new
		// players the tutorial
		if ((ige.namePrompt !== undefined && !ige.namePrompt.hidden) ||
			(ige.client.player.loggedIn() && !ige.client.player.hasGuestUsername)) {
			return;
		}
		var message = "Hi! We noticed that you are a guest user." + "<br>" +
			"Would you like to complete a short in-game tutorial?";
		alertify.confirm(message, function (e) {
			if (e) {
				var questName = TutorialQuest.prototype.classId();
				ige.network.send('cosmos:quest.requestStartQuest', questName);
				ige.client.metrics.track('cosmos:quest.tutorialQuest.clicked');
			} else {
				ige.client.metrics.track('cosmos:quest.tutorialQuest.skipped');
			}
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestSystem; }
