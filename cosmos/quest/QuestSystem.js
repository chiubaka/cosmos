var QuestSystem = IgeEventingClass.extend({
	classId: 'QuestSystem',
	componentId: 'questSystem',

	init: function() {
		if (ige.isServer) {
			ige.network.define('cosmos:quest.addQuest');
			ige.network.define('cosmos:quest.removeQuest');
			ige.network.define('cosmos:quest.eventToClient');
			ige.network.define('cosmos:quest.eventToServer', this._onEventToServer);
		}
		if (ige.isClient) {
			ige.network.define('cosmos:quest.addQuest', this._addQuestClient);
			ige.network.define('cosmos:quest.removeQuest', this._removeQuestClient);
			ige.network.define('cosmos:quest.eventToClient', this._onEventToClient);
			ige.addBehaviour('questStepClient', this._questStepClient);
		}
		this.log('Quest system initiated');
	},

	// @server-side
	addQuestServer: function(questName, instance, player) {
		player.quest.addQuest(questName, instance);
		var data = [questName, instance];
		ige.network.stream.queueCommand('cosmos:quest.addQuest', data, player.clientId());
	},

	// @client-side
	_addQuestClient: function(data) {
		var questName = data[0];
		var instance = data[1]
		ige.client.player.quest.addQuest(questName, instance);
	},

	// @server-side
	removeQuestServer: function() {
	},

	// @client-side
	_removeQuestClient: function() {
	},

	// @client-side
	eventToServer: function(event, quest) {
		var data = [quest.classId(), quest.instance, event]
		ige.network.send('cosmos:quest.eventToServer', data);
	},

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
		quest.emit(event);
	},

	// @server-side
	eventToClient: function(data, clientId) {
		ige.network.stream.queueCommand('cosmos:quest.eventToClient', data,
			clientId);
	},

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


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestSystem; }
