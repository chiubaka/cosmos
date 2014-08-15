var BlockGridPhysicsContainer = IgeEntity.extend({
	classId: "BlockGridPhysicsContainer",

	_debug: undefined,
	_debugContainer: undefined,
	_blockGrid: undefined,

	init: function(data) {
		IgeEntity.prototype.init.call(this, data);
	},

	addFixture: function(block) {

		// TODO: Add fixture debugging entities.
	},

	blockGrid: function(newBlockGrid) {
		if (newBlockGrid !== undefined) {
			this._blockGrid = newBlockGrid;
			if (this._debug) {
				this._debugContainer.mount(this._blockGrid);
			}
			return this;
		}

		return this._blockGrid;
	},

	_debugUpdate: function(ctx, tickDelta) {
		IgeEntity.prototype.update.call(this, ctx, tickDelta);
		//this._blockGrid.rotate().z(this.rotate().z());



		//this.rotate().z(0);
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = BlockGridPhysicsContainer;
}
