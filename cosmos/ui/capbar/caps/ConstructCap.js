var ConstructCap = Cap.extend({
	classId: 'ConstructCap',
	componentId: 'constructCap',

	init: function() {
		Cap.prototype.init.call(this, $('#cap-bar'), 'construct-cap', undefined, 'Construct');
	},

	select: function() {
		Cap.prototype.select.call(this);

		ige.hud.cargo.open();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructCap;
}