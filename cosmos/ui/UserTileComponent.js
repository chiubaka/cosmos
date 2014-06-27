var UserTileComponent = IgeEventingClass.extend({
	classId: 'UserTileComponent',
	componentId: 'userTile',

	element: undefined,
	profilePic: undefined,
	shipName: undefined,
	username: undefined,

	init: function() {
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			this.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(UserTileComponent.UI_ROOT + 'user-tile.html', function(html) {
			bottomToolbar.append(html);

			this.element = $('#user-tile');

			this.profilePic = this.element.find('.profile-pic');
			this.shipName = this.element.find('.ship-name');
			this.username = this.element.find('.username');
		});
	}
});

UserTileComponent.UI_ROOT = '/components/user-tile/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = UserTileComponent;
}