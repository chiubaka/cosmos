var ChatComponent = ButtonComponent.extend({
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

		var chatDiv = $('<div></div>');
		chatDiv.attr('id', 'chat');

		bottomToolbar.append(chatDiv);

		ButtonComponent.prototype.init.call(this, chatDiv, 'chat-button', undefined, 'Chat');
		self.button = $('#chat-button');

		self.unreadLabel = $('<span></span>').attr('id', 'chat-unread-label');
		self.button.append(self.unreadLabel);
		self.chatClient = $('<div></div>').attr('id', 'candy');

		chatDiv.append(self.chatClient);

		self.numUnread = 0;

		$.getScript(ChatComponent.CANDY_ROOT + 'libs/libs.min.js', function() {
			$.getScript(ChatComponent.CANDY_ROOT + 'candy.min.js', function() {
				Candy.init('http://tl-xmpp.cloudapp.net:5280/http-bind/', {
					core: {
						debug: false,
						autojoin: ['cosmos@conference.tl-xmpp.cloudapp.net']
					},
					view: { resources: ChatComponent.CANDY_ROOT + 'res/' }
				});

				var guestNumber = Math.floor((Math.random() * 999999999) + 100000000);
				var guestHandle = 'guest' + guestNumber;

				Candy.Core.connect('tl-xmpp.cloudapp.net', null, guestHandle);

				$(Candy).on('candy:core.message', function(evt, args) {
					if (args.timestamp === undefined && self.chatClient.is(':hidden')) {
						self.incrementUnread();
					}
				});

				$(Candy).on('candy:view.roster.after-update', function(evt, args) {
					if (args.action === 'join' && self.chatClient.is(':hidden')) {
						self.incrementUnread();
					}
				});

				// When a new room is added, find the message input field and tell it not to propagate keydown
				// events. Otherwise, the player will move in IGE while typing characters that are controls in the
				// game.
				$(Candy).on('candy:view.room.after-add', function() {
					self.messageInputs = self.chatClient.find('input.field');
					self.messageInputs.keydown(function(e) {
						e.stopPropagation();
					});
				});

				// Called when the chat client moves to the disconnected state.
				$(Candy).on('candy:view.connection.status-6', function() {
					// Delay a little bit here to allow the client to fully disconnect before trying to reconnect.
					setTimeout(function() {
						Candy.Core.connect('tl-xmpp.cloudapp.net', null, guestHandle);
					}, 200);
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
		this.unreadLabel.css('font-size', '' + (85 - (numChars - 1) * 20) + '%');
	}
});

ChatComponent.UI_ROOT = '/components/chat/';
ChatComponent.CANDY_ROOT = '/vendor/candy/'

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = ChatComponent;
}