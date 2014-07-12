var QuestComponent = IgeEventingClass.extend({
	classId: 'QuestComponent',
	componentId: 'quest',
	
	_activeQuests: undefined,
	_entity: undefined,

	init: function(entity, options) {
		this._activeQuests = {};
		this._entity = entity;
		this._entity.addBehaviour('questStep', this._behaviour);
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
		this._activeQuests[questName][instance] = new globalContext[questName];
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

	_behaviour: function(ctx) {
		var self = this.quest;
		// Loop over all quest names
		for (questName in self._activeQuests) {
			if (self._activeQuests.hasOwnProperty(questName)) {
				var instances = self._activeQuests[questName];
				// Loop over all instances of a quest name
				for (instance in instances) {
					if (instances.hasOwnProperty(instance)) {
						// Process behavior for that quest
						var quest = instances[instance];
						//console.log(quest);
						if (quest.isComplete === true) {
							self.removeQuest(questName, instance);
						}
						else {
							quest.processStep();
						}
					}
				}
			}
		}
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestComponent; }
