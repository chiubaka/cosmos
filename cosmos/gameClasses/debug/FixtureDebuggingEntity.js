var FixtureDebuggingBlock = IgeEntity.extend({
	classId: 'FixtureDebuggingBlock',

	init: function(data) {
		IgeEntity.prototype.init.call(this);

		if (data !== undefined) {
			this.width(data.width);
			this.height(data.height);
			this.depth(data.depth);
		}

		if (!ige.isServer) {
			this.texture(ige.client.textures.fixtureDebuggingTexture);
		}
	},

	streamCreateData: function() {
		return {
			width: this.width(),
			height: this.height(),
			depth: this.depth()
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FixtureDebuggingBlock; }
