var FixtureDebuggingBlock = IgeEntity.extend({
	classId: 'FixtureDebuggingBlock',

	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.texture(ige.client.textures.fixtureDebuggingTexture);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FixtureDebuggingBlock; }
