var QuestSystem = IgeEventingClass.extend({
	classId: 'QuestSystem',
	componentId: 'questSystem',

	init: function() {
		if (ige.isServer) {
			ige.network.define('cosmos:quest.addQuest');
		}
		if (ige.isClient) {
			ige.network.define('cosmos:quest.addQuest', this._addQuestClient);
		}
		this.log('Quest system initiated');
	},

	_addQuestClient: function(data) {
		var questName = data;
		ige.client.player.quest.addQuest(questName);
	},

	addQuestServer: function(questName, player) {
		// TODO: Make this based on quest
		quest = "TutorialQuest";
		player.quest.addQuest(questName);
		ige.network.stream.queueCommand('cosmos:quest.addQuest', questName,
			player.clientId());
	}



});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestSystem; }
