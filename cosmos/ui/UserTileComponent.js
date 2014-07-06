var UserTileComponent = IgeEventingClass.extend({
	classId: 'UserTileComponent',
	componentId: 'userTile',

	element: undefined,
	profilePic: undefined,
	shipName: undefined,
	username: undefined,

	init: function() {
		var self = this;
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			self.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(UserTileComponent.UI_ROOT + 'user-tile.html', function(html) {
			bottomToolbar.append(html);

			self.element = $('#user-tile');

			self.profilePic = self.element.find('.profile-pic');
			self.shipName = self.element.find('.ship-name');
			self.username = self.element.find('.username');

			ige.on('cosmos:client.player.username.set', function(username) {
				self.username.text(username);
				console.log('Set user tile name: ' + username);
			}, self, true);

			ige.emit('cosmos:hud.bottomToolbar.subcomponent.loaded', self);
		});
	}
});

UserTileComponent.UI_ROOT = '/components/user-tile/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = UserTileComponent;
}