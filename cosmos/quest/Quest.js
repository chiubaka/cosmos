var Quest = IgeEventingClass.extend({
	classId: 'Quest',
	questState: undefined,
	isComplete: undefined,

	init: function() {
	},


	processStep: function() {
		if (this.questState.condition.call(this)) {
			this.questState.action.call(this);
		}
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Quest; }
