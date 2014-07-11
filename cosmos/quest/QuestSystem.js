var QuestSystem = IgeEventingClass.extend({
	classId: 'QuestSystem',
	componentId: 'questSystem',

	init: function() {
		if (ige.isServer) {
			ige.network.define('cosmos:quest.addQuest');
			ige.network.define('cosmos:quest.removeQuest');
		}
		if (ige.isClient) {
			ige.network.define('cosmos:quest.addQuest', this._addQuestClient);
			ige.network.define('cosmos:quest.removeQuest', this._removeQuestClient);
		}
		this.log('Quest system initiated');
	},

	addQuestServer: function(questName, instance, player) {
		player.quest.addQuest(questName);
		var data = [questName, instance];
		ige.network.stream.queueCommand('cosmos:quest.addQuest', data, player.clientId());
	},

	_addQuestClient: function(data) {
		var questName = data[0];
		var instance = data[1]
		ige.client.player.quest.addQuest(questName, instance);
	},

	removeQuestServer: function() {
	},

	_removeQuestClient: function() {
	},


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestSystem; }
