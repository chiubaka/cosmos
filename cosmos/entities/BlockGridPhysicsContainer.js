var BlockGridPhysicsContainer = IgeEntityBox2d.extend({
	classId: "BlockGridPhysicsContainer",

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.4,
			angularDamping: 1.5,
			allowSleep: true,
			bullet: false,
			gravitic: false,
			fixedRotation: false
		});
	},

	addFixture: function(block) {
		var fixtureDef = this._createFixtureDef(block);

		block.fixtureDef(fixtureDef);

		if (block.fixture() !== undefined) {
			this._box2dBody.DestroyFixture(block.fixture());
		}

		// Add a new fixture based on the new fixture def.
		block.fixture(ige.box2d.addFixture(this._box2dBody, fixtureDef));

		// TODO: Add fixture debugging entities.
	},

	_createFixtureDef: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		return {
			density: BlockGrid.BLOCK_FIXTURE_DENSITY,
			friction: BlockGrid.BLOCK_FIXTURE_FRICTION,
			restitution: BlockGrid.BLOCK_FIXTURE_RESTITUTION,
			shape: {
				type: 'rectangle',
				data: {
					x: coordinates.x + BlockGrid.BLOCK_FIXTURE_PADDING,
					y: coordinates.y + BlockGrid.BLOCK_FIXTURE_PADDING,
					width: (block.gridData.width * Block.WIDTH) / 2
						- (2 * BlockGrid.BLOCK_FIXTURE_PADDING),
					height: (block.gridData.height * Block.HEIGHT) / 2
						- (2 * BlockGrid.BLOCK_FIXTURE_PADDING)
				}
			}
		}
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = BlockGridPhysicsContainer;
}