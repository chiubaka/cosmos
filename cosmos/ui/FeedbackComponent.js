var FeedbackComponent = ButtonComponent.extend({
	classId: 'FeedbackComponent',
	componentId: 'feedback',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'feedback-button');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = FeedbackComponent;
}