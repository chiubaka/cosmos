var QuestComponent = IgeEventingClass.extend({
	classId: 'QuestComponent',
	componentId: 'quest',
	
	activeQuests: undefined,

	init: function() {
		this.activeQuests = [];
	},

	addQuest: function (questName) {
		var globalContext = (ige.isServer) ? global : window;
		this.activeQuests.push(new globalContext[questName]);
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = QuestComponent; }
