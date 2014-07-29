var HaxBlock = IgeEntity.extend({
	classId: 'HaxBlock',

	init: function() {
		IgeEntity.prototype.init.call(this);
		if (!ige.isServer) {
			this.texture(ige.client.textures.background_helix_nebula);
		}
		this.width(100);
		this.height(100);
		this.addComponent(TLPhysicsComponent);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = HaxBlock; }
