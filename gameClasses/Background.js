var Background = IgeEntity.extend({
	classId: 'Background',
	
	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			//this.backgroundPattern(ige.client.textures.background_helix_nebula, 'repeat', true, false);
			this.texture(ige.client.textures.background_helix_nebula)
					.width(6145)
					.height(6623);

		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Background; }
