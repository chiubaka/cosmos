/**
 * Subclass of the {@link IgeEntity} class. Defines the entity for the laser beam that is displayed when a
 * {@link Player} mines a {@link Block}.
 * @class
 * @typedef {LaserBeam}
 * @namespace
 */
var LaserBeam = IgeEntity.extend({
	classId: 'LaserBeam',

	_source: undefined,
	_targetX: undefined,
	_targetY: undefined,

	init: function (createData) {
		IgeEntity.prototype.init.call(this);

		this.addComponent(LaserBeamRenderableComponent, {createDisplayObject: function () {
			var sprite = PIXI.Sprite.fromFrame('laserbeam');
			sprite.width = 10;
			sprite.anchor.set(0.5);
			return sprite;
		}});

		if (!ige.isServer) {
			// Fade in the laser beam
			this.opacity(0);
			this._fadeInTween();
		}
	},

	/**
	 * Sets the tween on this entity so that it appears to fade in.
	 * Note: Old sweeping laser tween is in commit c4192b5d5a7ee840a688744c8e6ad92fb2a97e51
	 * @returns {LaserBeam} Returns this object to make setter call chaining convenient.
	 * @memberof LaserBeam
	 * @private
	 */
	_fadeInTween: function () {
		this.tween()
			.targetObj(this.renderable)
			.stepTo({_opacity: 1}, 1000, 'inOutCubic')
			.start();

		if (this.pixiRenderable) {
			this.tween()
				.targetObj(this.pixiRenderable)
				.stepTo({_opacity: 1}, 1000, 'inOutCubic')
				.start();
		}

		return this;
	},

	setSource: function(block) {
		this._source = block;
		return this;
	},

	/**
	 * Sets the location of the targeted block.
	 * @param blockGridId {string} The IGE ID of the {@link BlockGrid} we are targeting
	 * @param row {number} The row of the {@link Block} we are targeting in its {@link BlockGrid}.
	 * @param col {number} The col of the {@link Block} we are targeting in its {@link BlockGrid}.
	 * @memberof LaserBeam
	 * @instance
 	 */
	setTarget: function(x, y) {
		this._targetX = x;
		this._targetY = y;
		return this;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = LaserBeam; }
