var TutorialQuest = IgeEventingClass.extend({
	classId: 'TutorialQuest',
	questStates: [],

	init: function() {
		this.questStates.push(this.hello);
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
