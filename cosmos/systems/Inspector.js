var Inspector = IgeEventingClass.extend({
	classId: 'Inspector',
	componentId: 'inspector',

	element: undefined,
	button: undefined,

	block: undefined,
	blockInspector: undefined,
	blockInspectorName: undefined,
	blockInspectorType: undefined,
	blockInspectorTextureImg: undefined,
	blockInspectorTextureCanvas: undefined,
	blockInspectorCurrentHealth: undefined,
	blockInspectorMaxHealth: undefined,
	blockInspectorEnergyUsage: undefined,
	blockInspectorDamage: undefined,
	blockInspectorThrust: undefined,
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

			self.blockInspectorType = self.blockInspector.find('#block-type');

			self.blockInspectorTextureImg = self.blockInspector.find('img.block-texture');
			self.blockInspectorTextureCanvas = self.blockInspector.find('canvas.block-texture');
			// Sets the height and width of the canvas equal to its CSS height and width
			self.blockInspectorTextureCanvas[0].width = self.blockInspectorTextureCanvas.width();
			self.blockInspectorTextureCanvas[0].height = self.blockInspectorTextureCanvas.height();

			self.blockInspectorCurrentHealth = self.blockInspector.find('#block-current-health');
			self.blockInspectorMaxHealth = self.blockInspector.find('#block-max-health');
			self.blockInspectorEnergyUsage = self.blockInspector.find('#block-energy-usage');
			self.blockInspectorDamage = self.blockInspector.find('#block-damage');
			self.blockInspectorThrust = self.blockInspector.find('#block-thrust');
			self.blockInspectorDescription = self.blockInspector.find('.description').first();

			ige.on('cosmos:block.mousedown', function(block) {
				self.inspect(block);
			});

			/*ige.on('cosmos:background.mousedown', function() {
				self.hide();
			});*/

			ige.emit('cosmos:hud.subcomponent.loaded', self);
		});
	},

	inspect: function(block) {
		var self = this;
		if (this.block && this.healthChangeListener) {
			this.block.off('cosmos:block.hp.changed', this.healthChangeListener);
		}
		this.block = block;
		this.blockInspectorName.text(block.displayName());
		this.blockInspectorType.text(block.type.text);
		this.blockInspectorDescription.text(block.description.text);

		this.blockInspector.find('.block-stat').hide();
		if (block.health instanceof Health) {
			this.blockInspector.find('#block-stat-health').show();
			this.blockInspectorCurrentHealth.text(block.health.value);
			this.blockInspectorMaxHealth.text(block.health.max);

			this.healthChangeListener = block.on('cosmos:block.hp.changed', function(hp) {
				// TODO: Change the color of the health text based on the percentage of health that is left
				self.blockInspectorCurrentHealth.text(Math.round(hp));
				if (hp <= 0) {
					self.blockInspector.hide();
				}
			});
		}

		if (block.damageSource instanceof DamageSource) {
			this.blockInspector.find('#block-stat-damage').show();
			this.blockInspectorDamage.text(block.damageSource.dps);
		}

		if (block.thrust instanceof Thrust) {
			this.blockInspector.find('#block-stat-thrust').show();
			this.blockInspectorThrust.text(block.thrust.value);
		}

		if (block instanceof Part) {
			this.blockInspectorTextureImg.show();
			this.blockInspectorTextureCanvas.hide();
			var img = this.blockInspectorTextureImg[0];
			img.src = window.location + "/assets/sprites/" + block.iconFrame;
		}
		else if (block instanceof Element) {
			this.blockInspectorTextureCanvas.show();
			this.blockInspectorTextureImg.hide();
			var canvas = this.blockInspectorTextureCanvas[0];

			// Clears the canvas
			canvas.width = canvas.width;
			var ctx = canvas.getContext("2d");
			var scaleWidth = canvas.width / block._bounds2d.x;
			var scaleHeight = canvas.height / block._bounds2d.y;
			ctx.scale(scaleWidth, scaleHeight);
			ctx.translate(block._bounds2d.x2, block._bounds2d.y2);
			block.texture().render(ctx, block);
		}


		this.blockInspector.show();
	},

	hide: function() {
		this.blockInspector.hide();
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
