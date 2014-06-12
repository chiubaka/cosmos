/**
 * An {@link IgeEntity} which represents the background of the game.
 * @class
 * @typedef {Background}
 * @namespace
 */
var Background = IgeEntity.extend({
	classId: 'Background',

	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {

			//this should make the background pattern repeat. I haven't gotten this to work yet.
			//this.backgroundPattern(ige.client.textures.background_helix_nebula, 'repeat', true, false);

			this.texture(ige.client.textures.background_helix_nebula)
				.width(6145 * 2)
				.height(6623 * 2);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Background; }
