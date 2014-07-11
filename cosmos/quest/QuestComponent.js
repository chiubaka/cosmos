var QuestComponent = IgeEventingClass.extend({
	classId: 'QuestComponent',
	componentId: 'quest',
	
	activeQuests: undefined,

	init: function() {
		this.activeQuests = {};
	},

	addQuest: function (questName, instance) {
		var globalContext = (ige.isServer) ? global : window;
		if (this.activeQuests.hasOwnProperty(questName)) {
			var quests = this.activeQuests[questName];
			if (quests.hasOwnProperty(instance)) {
				this.log('QuestComponent#addQuest: Quest already exists!', 'warn');
				return;
			}
		}
		this.activeQuests[questName] = this.activeQuests[questName] || {};
		this.activeQuests[questName][instance] = new globalContext[questName](instance);
	},

	removeQuest: function (questName, instance) {
		var globalContext = (ige.isServer) ? global : window;
		if (this.activeQuests.hasOwnProperty(questName)) {
			var quests = this.activeQuests[questName];
			if (quests.hasOwnProperty(instance)) {
				delete quests[instance];
				return;
			}
		}
		this.log('QuestComponent#removeQuest: Quest does not exist!', 'warn');
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestComponent; }
