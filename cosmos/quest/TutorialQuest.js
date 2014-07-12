var TutorialQuest = Quest.extend({
	classId: 'TutorialQuest',


	init: function() {
		Quest.prototype.init.call(this);
		this.isComplete = false;
		this.questState = this.states.hello;
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
