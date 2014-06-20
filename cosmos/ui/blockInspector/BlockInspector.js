
var BlockInspector = IgeEventingClass.extend({
	classId: 'BlockInspector',
	componentId: 'blockInspector',

	init: function() {
		var self = this;

		ige.requireScript(igeRoot + 'components/editor/vendor/jquery.2.0.3.min.js');

		ige.on('allRequireScriptsLoaded', function() {
			self.loadHtml(gameRoot + 'ui/blockInspector/blockInspector.html', function(html) {
				$('body').append($(html));
			});
		});
	},

	loadHtml: function (url, callback) {
		$.ajax({
			url: url,
			success: callback,
			dataType: 'html'
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockInspector; }