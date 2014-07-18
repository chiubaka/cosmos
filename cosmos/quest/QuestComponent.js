var QuestComponent = IgeEventingClass.extend({
	classId: 'QuestComponent',
	componentId: 'quest',
	
	_activeQuests: undefined,
	_unlockedQuests: undefined,

	init: function(entity, options) {
		this._activeQuests = {};
		// TODO: Load unlocked quests from DB
		this._unlockedQuests = {'TutorialQuest': true};
	},

	activeQuests: function() {
		return this._activeQuests;
	},

	unlockedQuests: function() {
		return this._unlockedQuests;
	},

	addQuest: function(questName, instance) {

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

	removeQuest: function(questName, instance) {
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

	/**
	 * Returns the next available instance number for a given quest.
	 * @param {String}
	 * @return {Number}
	 */
	getNextInstance: function(questName) {
		var nextInstance = 0;

		if (this._activeQuests.hasOwnProperty(questName)) {
			var quests = this._activeQuests[questName];
			nextInstance = _.max(_.map(_.keys(quests),parseIntDecimal)) + 1;
		}
		return nextInstance;

		// Needed to create a partial function
		// TODO: Remove this when lodash 3 is released with placeholder partials
		function parseIntDecimal(val) {
			return parseInt(val, 10);
		}
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestComponent; }
