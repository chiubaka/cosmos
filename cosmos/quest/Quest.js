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
		// TODO: Don't delete clientOnce; we might want to go back to a previous
		// quest state
		if (questState.clientOnce !== undefined) {
			questState.clientOnce.call(this);
			delete questState.clientOnce;
		}
		questState.clientStep.call(this);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Quest; }
