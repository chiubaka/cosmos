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

		ButtonComponent.prototype.init.call(this, chatDiv, 'chat-button', undefined, 'Chat', 'top');
		self.button = $('#chat-button');
		self.button.addClass('unopened');
		self.button.click(function() {
			$(this).removeClass('unopened');
		});

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

				ige.on('cosmos:client.player.username.set', function(username) {
					self.start();
				}, self, true);

				self.chatClient.hide();

				self.button.click(function(event) {
					if (self.chatClient.is(':visible')) {
						self.chatClient.hide();
						self.emit('cosmos:ChatComponent.hide');
					}
					else {
						self.chatClient.show();
						self.clearUnread();

						self.scrollToBottom(
							self.getActiveRoomPane().find('.message-pane-wrapper').first()
						);

						self.emit('cosmos:ChatComponent.show');
					}
				});

				ige.emit('cosmos:hud.bottomToolbar.subcomponent.loaded', self);
			});
		});
	},

	start: function() {
		var self = this;
		Candy.Core.connect('tl-xmpp.cloudapp.net', null, ige.client.player.username());

		// Called when the chat client moves to the disconnected state.
		$(Candy).on('candy:view.connection.status-6', function() {
			// Delay a little bit here to allow the client to fully disconnect before trying to reconnect.
			setTimeout(function() {
				Candy.Core.connect('tl-xmpp.cloudapp.net', null, ige.client.player.username());
			}, 200);
		});

		$(Candy).on('candy:core.message', function(evt, args) {
			if (args.timestamp === undefined && self.chatClient.is(':hidden')) {
				self.incrementUnread();
			}
		});

		$(Candy).on('candy:view.roster.after-update', function(evt, args) {
			// Don't increment unread when the player joins the game
			if (args.action === 'join' && self.chatClient.is(':hidden') && args.user.getNick() !== ige.client.player.username()) {
				self.incrementUnread();
			}
		});

		// When a new room is added, find the message input field and tell it not to propagate keydown
		// events. Otherwise, the player will move in IGE while typing characters that are controls in the
		// game.
		$(Candy).on('candy:view.room.after-add', function() {
			// If the room that was just added is the active room, then scroll to the
			// bottom. Otherwise, don't scroll to the bottom because then we would be
			// scrolling to the bottom in response to a new room being added even
			// though we're not focused on that room.
			var activeRoomPane = self.getActiveRoomPane();
			if (activeRoomPane
				&& activeRoomPane.index() === $('.room-pane').length - 1)
			{
				self.scrollToBottom(activeRoomPane.find('.message-pane-wrapper').first());
			}

			var messageInputs = $('.message-form-wrapper input.field');
			var newInput = messageInputs.last();
			newInput.focus(function() {
				var focusedInput = $(this);
				$('#igeFrontBuffer').on('click.chatFocused', function() {
					focusedInput.blur();
				});
			});
			newInput.focusout(function() {
				$('#igeFrontBuffer').off('click.chatFocused');
			});
		});
	},

	incrementUnread: function() {
		this.button.removeClass('unopened');
		this.button.addClass('unread');
		this.numUnread++;
		this.updateLabel();
	},

	clearUnread: function() {
		this.button.removeClass('unread');
		this.numUnread = 0;
		this.updateLabel();
	},

	/**
	 * Gets the active room pane by finding the room pane that is visible. Only
	 * one room can be visible at a time.
	 * @returns {*}
	 */
	getActiveRoomPane: function() {
		var roomPanes = $('.room-pane:visible');
		if (roomPanes.length === 0) {
			return null;
		}

		return roomPanes.eq(0);
	},

	updateLabel: function() {
		this.unreadLabel.text(this.numUnread);

		var numChars = this.numUnread.toString().length;
		this.unreadLabel.css('font-size', '' + (85 - (numChars - 1) * 20) + '%');
	},

	/**
	 * Scrolls the given messagePaneWrapper all the way to the bottom. The
	 * messagePaneWrapper is the div that contains all of the chat messages for
	 * a room.
	 * @param messagePaneWrapper
	 */
	scrollToBottom: function(messagePaneWrapper) {
		if (!messagePaneWrapper) {
			return;
		}

		messagePaneWrapper[0].scrollTop = messagePaneWrapper[0].scrollHeight;
	}
});

ChatComponent.UI_ROOT = '/components/chat/';
ChatComponent.CANDY_ROOT = '/vendor/candy/';

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = ChatComponent;
}
