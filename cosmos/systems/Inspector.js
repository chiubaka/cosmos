var Inspector = IgeEventingClass.extend({
	classId: 'Inspector',
	componentId: 'inspector',

	element: undefined,
	button: undefined,

	block: undefined,
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

			ige.on('cosmos:background.mousedown', function() {
				self.blockInspector.hide();
			});

			ige.emit('cosmos:hud.subcomponent.loaded', self);
		});
	},

	inspect: function(block) {
		var self = this;
		this.block = block;
		this.blockInspector.show();
		this.blockInspectorName.text(block.displayName());
		this.blockInspectorDescription.text(block.description());

		this.blockInspector.find('.block-stat').hide();
		if (block.health !== undefined) {
			this.blockInspector.find('#block-stat-health').show();
			this.blockInspectorCurrentHealth.text(block.health.value);
			this.blockInspectorMaxHealth.text(block.health.max);

			block.on('cosmos:block.hp.changed', function(hp) {
				// TODO: Change the color of the health text based on the percentage of health that is left
				self.blockInspectorCurrentHealth.text(Math.round(hp));
				if (hp <= 0) {
					self.blockInspector.hide();
				}
			});
		}

		if (block.damageSource !== undefined) {
			this.blockInspector.find('#block-stat-damage').show();
			this.blockInspectorDamage.text(block.damageSource.dps);
		}

		var canvas = this.blockInspectorTexture[0];
		// Clears the canvas
		canvas.width = canvas.width;
		var ctx = canvas.getContext("2d");
		var scaleWidth = canvas.width / block._bounds2d.x;
		var scaleHeight = canvas.height / block._bounds2d.y;
		ctx.scale(scaleWidth, scaleHeight);
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