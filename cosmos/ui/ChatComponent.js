var ChatComponent = IgeEventingClass.extend({
	classId: 'ChatComponent',
	componentId: 'chat',

	button: undefined,
	chatClient: undefined,

	init: function() {
		var self = this;
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			this.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(ChatComponent.UI_ROOT + 'chat.html', function(html) {
			bottomToolbar.append(html);
			self.button = $('#chat-button');

			//ige.requireStylesheet(ChatComponent.CANDY_ROOT + 'res/default.css');

			$.getScript(ChatComponent.CANDY_ROOT + 'libs/libs.min.js', function() {
				$.getScript(ChatComponent.CANDY_ROOT + 'candy.min.js', function() {
					Candy.init('http://tl-xmpp.cloudapp.net:5280/http-bind/', {
						core: {
							debug: true,
							autojoin: ['test@conference.tl-xmpp.cloudapp.net']
						},
						view: { resources: ChatComponent.CANDY_ROOT + 'res/' }
					});

					Candy.Core.connect('dchiu@tl-xmpp.cloudapp.net', 'CS210-l3on1ne!');

					self.chatClient = $('#candy');
					self.chatClient.hide();

					self.button.click(function(event) {
						if (self.chatClient.is(':visible')) {
							self.chatClient.hide();
						}
						else {
							self.chatClient.show();
						}
					});
				});
			});
		});

	}
});

ChatComponent.UI_ROOT = '/components/chat/';
ChatComponent.CANDY_ROOT = '/vendor/candy/'

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = ChatComponent;
}