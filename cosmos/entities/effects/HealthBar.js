/**
 * @class
 * @typedef {HealthBar}
 * @namespace
 */
var HealthBar = IgeEntity.extend({
	classId: 'HealthBar',

	/**
	 * The block associated with this health bar
	 * @type {Block}
	 * @memberof HealthBar
	 * @private
	 * @instance
	 */
	_block: undefined,

	init: function(block) {
		IgeEntity.prototype.init.call(this);
		this._block = block;

		//this.texture(ige.client.textures.healthBar);
		// TODO: Add PixiRenderableComponent for health bars
	}

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HealthBar; }
