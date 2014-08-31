/**
 * The ExampleShips class has some prefabricated ships that can be used for creating players or just for testing.
 * @class
 * @namespace
 */
var ExampleShips = {
	/**
	 * This is the ship in beginning of the video. This ships contains pretty much the minimum amount that a player
	 * needs to get started.
	 * @retruns {Array} A {@link Block} matrix that represents the starter ship.
	 * @memberof ExampleShips
	 */
	starterShip: function() {
		return [
			[undefined,           undefined,   new RedLaserBlock(), undefined,   undefined],
			[undefined,           new SteelPlatingBlock(), new SteelPlatingBlock(),            new SteelPlatingBlock(), undefined],
			[undefined,           new SteelPlatingBlock(), new BridgeBlock(),     new SteelPlatingBlock(), undefined],
			[undefined,           new SteelPlatingBlock(), new PowerBlock(),       new SteelPlatingBlock(), undefined],
			[new IronThrusterBlock(), new SteelPlatingBlock(), new CargoBlock,         new SteelPlatingBlock(), new IronThrusterBlock()],
			[undefined,           new SteelPlatingBlock(), new CargoBlock,         new SteelPlatingBlock(), undefined],
			[undefined,           new SteelPlatingBlock(), new FuelBlock,          new SteelPlatingBlock(), undefined],
			[undefined,           new SteelPlatingBlock(), new IronEngineBlock(),      new SteelPlatingBlock(), undefined]
		]
	},
	
	/**
	 * This is the ship in the middle of the video. It has two engines, but one of them is misplaced and unbalanced.
	 * @returns {Array} A {@link Block} matrix that represents the starter ship with two, unbalanced engines.
	 * @memberof ExampleShips
	 */
	starterShipSingleMisplacedEngine: function() {
		return [
			[undefined,           undefined,         new RedLaserBlock(), undefined,         undefined],
			[undefined,           new SteelPlatingBlock(),       new SteelPlatingBlock(),            new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new BridgeBlock(),     new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new PowerBlock(),       new SteelPlatingBlock(),       undefined],
			[new IronThrusterBlock(), new SteelPlatingBlock(),       new CargoBlock,         new SteelPlatingBlock(),       new IronThrusterBlock()],
			[undefined,           new SteelPlatingBlock(),       new CargoBlock,         new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new FuelBlock,          new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new IronEngineBlock(),      new SteelPlatingBlock(),       undefined],
			[undefined,           new IronEngineBlock(), undefined,              undefined,         undefined]
		]
	},

	/**
	 * This is the ship at the end of the video. It has two, balanced engines at the bottom.
	 * @returns {Array} A {@link Block} matrix that represents the starter ship with two balanced engines on the bottom.
	 * @memberof ExampleShips
	 */
	starterShipDoubleEngines: function() {
		return [
			[undefined,           undefined,         new RedLaserBlock(), undefined,         undefined],
			[undefined,           new SteelPlatingBlock(),       new SteelPlatingBlock(),            new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new BridgeBlock(),     new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new PowerBlock(),       new SteelPlatingBlock(),       undefined],
			[new IronThrusterBlock(), new SteelPlatingBlock(),       new CargoBlock,         new SteelPlatingBlock(),       new IronThrusterBlock()],
			[undefined,           new SteelPlatingBlock(),       new CargoBlock,         new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       new FuelBlock,          new SteelPlatingBlock(),       undefined],
			[undefined,           new SteelPlatingBlock(),       undefined,              new SteelPlatingBlock(),       undefined],
			[undefined,           new IronEngineBlock(), undefined,              new IronEngineBlock(), undefined]
		]
	},

	/**
	 * This is an empty ship for use in testing.
	 * @returns {Array} A {@link Block} matrix that contains nothing but undefined's.
	 * @memberof ExampleShips
	 */
	emptyShip: function() {
		return [
			[undefined, undefined, undefined, undefined, undefined],
			[undefined, undefined, undefined, undefined, undefined],
			[undefined, undefined, undefined, undefined, undefined],
			[undefined, undefined, undefined, undefined, undefined],
			[undefined, undefined, undefined, undefined, undefined]
		];
	},

	/**
	 * Returns a ship that consists of just an engine. Useful for testing purposes.
	 * @returns {Array} A {@link Block} matrix that contains just an {@link IronEngineBlock}.
	 * @memberof ExampleShips
	 */
	justAnEngine: function() {
		return [
			[new IronEngineBlock()]
		];
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ExampleShips; }
