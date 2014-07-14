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
		if (this.questState.once !== undefined) {
			this.questState.once.call(this);
			delete this.questState.once;
		}
		this.questState.client.call(this);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Quest; }
