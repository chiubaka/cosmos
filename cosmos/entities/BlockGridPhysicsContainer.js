var BlockGridPhysicsContainer = IgeEntityBox2d.extend({
	classId: "BlockGridPhysicsContainer",

	_debug: undefined,
	_debugContainer: undefined,
	_blockGrid: undefined,

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

		this._debug = true;
		if (this._debug) {
			this._debugContainer = new BlockGridFixtureDebugContainer()
				.streamMode(1);
		}
	},

	addFixture: function(block) {
		var fixtureDef = this._createFixtureDef(block);

		block.fixtureDef(fixtureDef);

		if (block.fixture() !== undefined) {
			this._box2dBody.DestroyFixture(block.fixture());
		}

		// Add a new fixture based on the new fixture def.
		block.fixture(ige.box2d.addFixture(this._box2dBody, fixtureDef));

		if (this._debug) {
			if (block.fixtureDebuggingEntity() !== undefined) {
				block.fixtureDebuggingEntity().destroy();
			}

			console.log(fixtureDef.shape.data.x);
			console.log(fixtureDef.shape.data.y);
			console.log(fixtureDef.shape.data.width);
			console.log(fixtureDef.shape.data.height);

			var fixtureDebuggingEntity = new FixtureDebuggingEntity()
				.depth(this._debugContainer.depth() + 1)
				.translateTo(fixtureDef.shape.data.x, fixtureDef.shape.data.y, 0)
				.width(fixtureDef.shape.data.width * 2)
				.height(fixtureDef.shape.data.height * 2)
				.streamMode(1)
				.mount(this._debugContainer);

			block.fixtureDebuggingEntity(fixtureDebuggingEntity);
		}
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

	translateTo: function(x, y, z) {
		IgeEntityBox2d.prototype.translateTo.call(this, x, y, z);
		this._debugContainer.translateTo(x, y, z);
	},

	_createFixtureDef: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		var width = block.width();
		var height = block.height();
		return {
			density: BlockGrid.BLOCK_FIXTURE_DENSITY,
			friction: BlockGrid.BLOCK_FIXTURE_FRICTION,
			restitution: BlockGrid.BLOCK_FIXTURE_RESTITUTION,
			shape: {
				type: 'rectangle',
				data: {
					x: coordinates.x - width / 2 + BlockGrid.BLOCK_FIXTURE_PADDING,
					y: coordinates.y - height / 2 + BlockGrid.BLOCK_FIXTURE_PADDING,
					width: width / 2 - (2 * BlockGrid.BLOCK_FIXTURE_PADDING),
					height: height / 2 - (2 * BlockGrid.BLOCK_FIXTURE_PADDING)
				}
			}
		}
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = BlockGridPhysicsContainer;
}