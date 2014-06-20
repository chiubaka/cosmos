
var BlockInspector = IgeEventingClass.extend({
	classId: 'BlockInspector',
	componentId: 'blockInspector',

	ui: undefined,

	init: function() {
		var self = this;

		this.ui = {};

		ige.requireScript(igeRoot + 'components/editor/vendor/jquery.2.0.3.min.js');

		ige.on('allRequireScriptsLoaded', function() {
			self.loadHtml(gameRoot + 'ui/blockInspector/blockInspector.html', function(html) {
				$('body').append($(html));

				self.ui.container = $('#block-inspector');
				self.ui.name = $('#block-inspector-name');
				self.ui.description = $('#block-inspector-description');

				self.ui.container.hide();
			});
		});
	},

	inspect: function(block) {
		this.ui.container.show();
		this.ui.name.text(block.displayName());
		this.ui.description.text('This is a block.');
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