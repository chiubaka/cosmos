/**
 * @class
 * @typedef {HealthBar}
 * @namespace
 */
var HealthBar = IgeEntity.extend({
	classId: 'HealthBar',

	/**
	 * The entity associated with this health bar
	 * @type {IgeEntity}
	 * @memberof HealthBar
	 * @private
	 * @instance
	 */
	 	_entity: undefined,

	init: function(entity) {
		IgeEntity.prototype.init.call(this);
		this._entity = entity;
	},

	tick: function (ctx) {
		// Draw block health
		// The current width of the health bar computed based on the percentage of health remaining
		var healthBarWidth = (this._entity.width() - 2 * Block.HEALTH_BAR_MARGIN)
			* (this._entity._hp / this._entity.MAX_HP);

		// The x-coordinate to start drawing the health bar based on the margin constant from the Block class
		var healthBarStartX = -this._entity._bounds2d.x2 + Block.HEALTH_BAR_MARGIN;

		// Fill color is red
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.beginPath();
		ctx.moveTo(healthBarStartX, this._entity._bounds2d.y2 - Block.HEALTH_BAR_MARGIN - Block.HEALTH_BAR_HEIGHT);
		ctx.lineTo(healthBarStartX, this._entity._bounds2d.y2 - Block.HEALTH_BAR_MARGIN);
		ctx.lineTo(healthBarStartX + healthBarWidth, this._entity._bounds2d.y2 - Block.HEALTH_BAR_MARGIN);
		ctx.lineTo(healthBarStartX + healthBarWidth, this._entity._bounds2d.y2 - Block.HEALTH_BAR_MARGIN
			- Block.HEALTH_BAR_HEIGHT);
		ctx.lineTo(healthBarStartX, this._entity._bounds2d.y2 - Block.HEALTH_BAR_MARGIN - Block.HEALTH_BAR_HEIGHT);
		ctx.fill();

		IgeEntity.prototype.tick.call(this. ctx);
	}

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = HealthBar; }
