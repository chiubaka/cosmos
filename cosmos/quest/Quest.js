var Quest = IgeEventingClass.extend({
	classId: 'Quest',
	questState: undefined,
	isComplete: undefined,
	instance: undefined,

	init: function(instance) {
		this.instance = instance;
	},


	processStep: function() {
		if (this.questState.condition.call(this)) {
			this.questState.action.call(this);
		}
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Quest; }
