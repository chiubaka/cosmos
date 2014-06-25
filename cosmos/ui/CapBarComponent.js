var CapBarComponent = IgeEventingClass.extend({
	classId: 'CapBarComponent',
	componentId: 'capBar',

	element: undefined,

	init: function() {
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			this.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		var capBarDiv = document.createElement('div');
		capBarDiv.id = 'cap-bar';

		bottomToolbar.append(capBarDiv);

		this.element = $('#cap-bar');

		// TODO: Check whether or not the right blocks are on the player's ship before adding these capabilities
		this.addComponent(MineCapComponent);
		this.addComponent(ConstructCapComponent);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = CapBarComponent;
}