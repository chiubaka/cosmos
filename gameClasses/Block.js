var Block = IgeEntityBox2d.extend({
	classId: 'Block',
	
	init: function () {
		IgeEntity.prototype.init.call(this);

		if (ige.isServer) {
			this.box2dBody({
				type: 'dynamic',
				linearDamping: 0.1,
				angularDamping: 0.1,
				allowSleep: true,
				bullet: false,
				gravitic: true,
				fixedRotation: false,
				fixtures: [{
					density: 1.0,
					friction: 0.5,
					restitution: 0.2,
					shape: {
						type: 'rectangle'
					}
				}]

			})
		}
		else {
			this.texture(ige.client.textures.block_power_gold)
					.width(100)
					.height(100);
		}

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
