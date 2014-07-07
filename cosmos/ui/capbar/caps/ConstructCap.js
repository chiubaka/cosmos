var ConstructCap = Cap.extend({
	classId: 'ConstructCap',
	componentId: 'constructCap',

	init: function() {
		Cap.prototype.init.call(this, $('#cap-bar'), 'construct-cap', undefined, 'Construct');

		ige.emit('cosmos:hud.bottomToolbar.capBar.subcomponent.loaded', this);
	},

	select: function() {
		Cap.prototype.select.call(this);

		ige.hud.leftToolbar.windows.cargo.open();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructCap;
}
