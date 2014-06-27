var MenuComponent = ButtonComponent.extend({
	classId: 'MenuComponent',
	componentId: 'menu',

	init: function() {
		ButtonComponent.prototype.init.call(this, $('#bottom-toolbar'), 'menu-button', undefined, 'Menu');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MenuComponent;
}