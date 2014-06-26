var ChatComponent = IgeEventingClass.extend({
	classId: 'ChatComponent',
	componentId: 'chat',

	button: undefined,
	chatClient: undefined,
	numUnread: undefined,
	unreadLabel: undefined,
	messageInputs: undefined,

	init: function() {
		var self = this;
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			self.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		self.numUnread = 0;

		HUDComponent.loadHtml(ChatComponent.UI_ROOT + 'chat.html', function(html) {
			bottomToolbar.append(html);
			self.button = $('#chat-button');
			self.unreadLabel = $('#chat-unread-label');

			//ige.requireStylesheet(ChatComponent.CANDY_ROOT + 'res/default.css');

			$.getScript(ChatComponent.CANDY_ROOT + 'libs/libs.min.js', function() {
				$.getScript(ChatComponent.CANDY_ROOT + 'candy.min.js', function() {
					Candy.init('http://tl-xmpp.cloudapp.net:5280/http-bind/', {
						core: {
							debug: false,
							autojoin: ['test@conference.tl-xmpp.cloudapp.net']
						},
						view: { resources: ChatComponent.CANDY_ROOT + 'res/' }
					});

					var guestNumber = Math.floor((Math.random() * 999999999) + 100000000)

					Candy.Core.connect('tl-xmpp.cloudapp.net', null, 'guest' + guestNumber);
					//Candy.Core.connect('dchiu@tl-xmpp.cloudapp.net', 'CS210-l3on1ne!');

					self.chatClient = $('#candy');

					$(Candy).on('candy:core.message', function(evt, args) {
						if (args.timestamp === undefined && self.chatClient.is(':hidden')) {
							self.incrementUnread();
						}
					});

					// When a new room is added, find the message input field and tell it not to propagate keydown
					// events. Otherwise, the player will move in IGE while typing characters that are controls in the
					// game.
					$(Candy).on('candy:view.room.after-add', function() {
						self.messageInputs = self.chatClient.find('input.field');
						console.log(self.messageInputs);
						self.messageInputs.keydown(function(e) {
							e.stopPropagation();
						});
					});

					self.button.click(function(event) {
						if (self.chatClient.is(':visible')) {
							self.chatClient.hide();
						}
						else {
							self.chatClient.show();
							self.clearUnread();
						}
					});
				});
			});
		});
	},

	incrementUnread: function() {
		this.button.addClass('unread');
		this.numUnread++;
		this.updateLabel();
	},

	clearUnread: function() {
		this.button.removeClass('unread');
		this.numUnread = 0;
		this.updateLabel();
	},

	updateLabel: function() {
		this.unreadLabel.text(this.numUnread);

		var numChars = this.numUnread.toString().length;
		this.button.css('font-size', '' + (85 - (numChars - 1) * 20) + '%');
	}
});

ChatComponent.UI_ROOT = '/components/chat/';
ChatComponent.CANDY_ROOT = '/vendor/candy/'

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = ChatComponent;
}