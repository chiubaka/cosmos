var NamePrompt = IgeEventingClass.extend({
	classId: 'NamePrompt',
	componentId: 'namePrompt',

	element: undefined,
	shipNameInput: undefined,
	usernameInput: undefined,
	goButton: undefined,
	skipButton: undefined,
	hidden: undefined,

	init: function(){
		var self = this;
		// TODO: Move name prompt html from jade file into here. 
		self.element = $('#name-prompt');
		self.shipNameInput = self.element.find('#ship-name-input');
		self.usernameInput = self.element.find('#username-input');
		self.goButton = self.element.find('#name-prompt-go');
		self.skipButton = self.element.find('#name-prompt-skip');

		self.shipNameInput.keydown(function(e) {
			e.stopPropagation();
		});

		self.usernameInput.keydown(function(e) {
			e.stopPropagation();
		});

		self.goButton.click(function(e) {
			var username = self.usernameInput.val();
			if (!Player.usernameIsCorrectLength(username)) {
				ige.emit('cosmos:player.username.set.error', 'Username must be between 2 and 12 characters');
			}
			else if (!Player.usernameIsAlphanumericUnderscore(username)) {
				ige.emit('cosmos:player.username.set.error', 'Alphanumeric characters and underscores only');
			}
			else {
				ige.client.player.requestUsername(self.usernameInput.val());
			}
		});

		self.skipButton.click(function(e) {
			ige.emit('cosmos:namePrompt.skipped');
			ige.emit('cosmos:client.player.username.set', ige.client.player.username());
			self.hide();
		});

		ige.on('cosmos:player.username.set.error', function(error) {
			// Clear the input
			self.usernameInput.val('');

			// Display the error as placeholder text
			self.usernameInput.attr('placeholder', error);

			self.usernameInput.addClass('error');
		});

		var clientPlayerUsernameSetListener = ige.on('cosmos:client.player.username.set', function(username) {
			if (!ige.client.player.hasGuestUsername) {
				ige.emit('cosmos:client.player.login', username);
			}
			self.hide();
		}, self, true);

		self.show();
	},

	show: function() {
		this.hidden = false;
		this.element.show();
		ige.hud.hide();
	},

	hide: function() {
		this.hidden = true;
		this.element.hide();
		ige.hud.show();
		ige.emit('cosmos:NamePrompt.hide');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NamePrompt;
}
