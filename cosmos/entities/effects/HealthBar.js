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

		this.addComponent(HealthBarRenderableComponent, {
			createDisplayObject: function() {
				return new PIXI.Graphics();
			},
			anchor: new IgePoint2d(-block.width() / 2, -block.height() / 2)
		});
	}

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HealthBar; }
