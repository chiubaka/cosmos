var TutorialQuest = IgeEventingClass.extend({
	classId: 'TutorialQuest',
	instance: undefined,
	questState: undefined,
	isComplete: undefined,

	init: function() {
		this.isComplete = false;
		this.questState = this.states.hello;
	},


	processStep: function() {
		if (this.questState.condition.call(this)) {
			this.questState.action.call(this);
		}
	},

	states: {
		hello: {
			condition: function() {
				return true;
			},
			action: function() {
				console.log('Tutorial quest');
				this.questState = this.states.complete;
			}
		},
		complete: {
			condition: function() {
				return true;
			},
			action: function() {
				this.isComplete = true;
			}
		}

	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = TutorialQuest; }
