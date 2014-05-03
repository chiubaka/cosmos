var HUDManager = IgeClass.extend({
	classId: 'HUDManager',

	_capbar: undefined,

	init: function(game) {
		console.log("Initializing HUDManager...");
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = HUDManager;
}