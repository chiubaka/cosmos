var TutorialQuest = IgeEventingClass.extend({
	classId: 'TutorialQuest',
	instance: undefined,
	questStates: [],

	init: function(instance) {
		this.questStates.push(this.hello);
		this.instance = instance;
	},

	hello: {
		condition: function() {
			return true;
		},
		action: function() {
			console.log('Tutorial quest');
		}
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = TutorialQuest; }
