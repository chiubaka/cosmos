var Quest = IgeEventingClass.extend({
	classId: 'Quest',
	questState: undefined,
	instance: undefined,
	objectiveNotifications: undefined,

	init: function(instance) {
		this.instance = instance;
	},


	// @client-side
	processStep: function() {
		var questState = this.questState;
		if (questState.once !== undefined) {
			questState.once.call(this);
			delete questState.once;
		}
		questState.client.call(this);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Quest; }
