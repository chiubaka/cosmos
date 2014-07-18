var Quest = IgeEventingClass.extend({
	classId: 'Quest',
	// How far the player is in the quest
	questState: undefined,
	// The instance number of the quest. Some quests can be instantiated multiple times,
	// for example a "mine X blocks" quest
	instance: undefined,

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
		if (questState.clientStep !== undefined) {
			questState.clientStep.call(this);
		}
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Quest; }
