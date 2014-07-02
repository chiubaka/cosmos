var Inspector = IgeEventingClass.extend({
	classId: 'Inspector',
	componentId: 'inspector',

	element: undefined,
	button: undefined,

	blockInspector: undefined,
	blockInspectorName: undefined,
	blockInspectorTexture: undefined,
	blockInspectorCurrentHealth: undefined,
	blockInspectorMaxHealth: undefined,
	blockInspectorEnergyUsage: undefined,
	blockInspectorDamage: undefined,
	blockInspectorDescription: undefined,

	init: function() {
		var self = this;
		var hud = $('#hud');
		if (hud.length === 0) {
			self.log('HUD has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(Inspector.UI_ROOT + 'inspector.html', function(html) {
			hud.append(html);

			self.element = $('#inspector');
			self.button = self.element.find('.button').first();

			self.blockInspector = self.element.find('#block-inspector');
			self.blockInspectorName = self.blockInspector.find('#block-name');

			self.blockInspectorTexture = self.blockInspector.find('#block-texture');
			// Sets the height and width of the canvas equal to its CSS height and width
			self.blockInspectorTexture[0].width = self.blockInspectorTexture.width();
			self.blockInspectorTexture[0].height = self.blockInspectorTexture.height();

			self.blockInspectorCurrentHealth = self.blockInspector.find('#block-current-health');
			self.blockInspectorMaxHealth = self.blockInspector.find('#block-max-health');
			self.blockInspectorEnergyUsage = self.blockInspector.find('#block-energy-usage');
			self.blockInspectorDamage = self.blockInspector.find('#block-damage');
			self.blockInspectorDescription = self.blockInspector.find('.description').first();

			ige.on('cosmos:block.mousedown', function(block) {
				self.inspect(block);
			});

			ige.emit('cosmos:hud.subcomponent.loaded', self);
		});
	},

	inspect: function(block) {
		this.blockInspector.show();
		this.blockInspectorName.text(block.displayName());
		this.blockInspectorDescription.text(block.description());

		var canvas = this.blockInspectorTexture[0];
		// Clears the canvas
		canvas.width = canvas.width;
		var ctx = canvas.getContext("2d");
		ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
		block.texture().render(ctx, block);
		setTimeout(function() {
			block.texture().render(ctx, block);
		}, 100);
	},

	loadHtml: function (url, callback) {
		$.ajax({
			url: url,
			success: callback,
			dataType: 'html'
		});
	}
});

Inspector.UI_ROOT = '/components/inspector/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Inspector; }