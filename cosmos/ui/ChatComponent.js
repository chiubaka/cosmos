var ChatComponent = IgeEventingClass.extend({
	classId: 'ChatComponent',
	componentId: 'chat',

	element: undefined,

	init: function() {
		var self = this;
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			this.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(ChatComponent.UI_ROOT + 'chat.html', function(html) {
			bottomToolbar.append(html);
			this.element = $('#chat');
		});
	}
});

ChatComponent.UI_ROOT = '/components/chat/';

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = ChatComponent;
}