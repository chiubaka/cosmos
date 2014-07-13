var QuestComponent = IgeEventingClass.extend({
	classId: 'QuestComponent',
	componentId: 'quest',
	
	_activeQuests: undefined,

	init: function(entity, options) {
		this._activeQuests = {};
	},

	activeQuests: function () {
		return this._activeQuests;
	},

	addQuest: function (questName, instance) {
		var globalContext = (ige.isServer) ? global : window;
		if (this._activeQuests.hasOwnProperty(questName)) {
			var quests = this._activeQuests[questName];
			if (quests.hasOwnProperty(instance)) {
				this.log('QuestComponent#addQuest: Quest already exists!', 'warn');
				return;
			}
		}
		this._activeQuests[questName] = this._activeQuests[questName] || {};
		this._activeQuests[questName][instance] = new globalContext[questName](instance);
	},

	removeQuest: function (questName, instance) {
		var globalContext = (ige.isServer) ? global : window;
		if (this._activeQuests.hasOwnProperty(questName)) {
			var quests = this._activeQuests[questName];
			if (quests.hasOwnProperty(instance)) {
				delete quests[instance];
				return;
			}
		}
		this.log('QuestComponent#removeQuest: Quest does not exist!', 'warn');
	},



});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestComponent; }
