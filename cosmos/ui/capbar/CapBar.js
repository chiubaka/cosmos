var CapBar = IgeEventingClass.extend({
	classId: 'CapBar',
	componentId: 'capBar',

	element: undefined,
	numElementsToLoad: undefined,

	init: function() {
		var self = this;
		var bottomToolbar = $('#bottom-toolbar');
		if (bottomToolbar.length === 0) {
			this.log('Bottom toolbar has not been initialized.', 'error');
			return;
		}

		var capBarDiv = document.createElement('div');
		capBarDiv.id = 'cap-bar';

		bottomToolbar.append(capBarDiv);

		this.element = $('#cap-bar');

		this.numElementsToLoad = 2;

		ige.on('cosmos:hud.bottomToolbar.capBar.subcomponent.loaded', function(component) {
			self.numElementsToLoad--;
			if (self.numElementsToLoad === 0) {
				ige.emit('cosmos:hud.bottomToolbar.subcomponent.loaded', self);
			}
		});

		// TODO: Check whether or not the right blocks are on the player's ship before adding these capabilities
		this.addComponent(MineCap);
		this.addComponent(ConstructCap);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = CapBar;
}