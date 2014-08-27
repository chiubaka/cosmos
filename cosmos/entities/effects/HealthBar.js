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
				var graphic = new PIXI.Graphics();

				console.log("Block width: " + block.width());
				console.log("Graphic width: " + graphic.width);

				return graphic;
			}
		});
	}

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HealthBar; }
