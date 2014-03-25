var ExampleShips = {
	/**
	 * This is the ship in beginning of the video
	 */
	starterShip: function () {
		return [
			[undefined,           undefined,   new MiningLaserBlock(), undefined,   undefined],
			[undefined,           new Block(), new Block(),            new Block(), undefined],
			[undefined,           new Block(), new ControlBlock(),     new Block(), undefined],
			[undefined,           new Block(), new PowerBlock(),       new Block(), undefined],
			[new ThrusterBlock(), new Block(), new CargoBlock,         new Block(), new ThrusterBlock()],
			[undefined,           new Block(), new CargoBlock,         new Block(), undefined],
			[undefined,           new Block(), new FuelBlock,          new Block(), undefined],
			[undefined,           new Block(), new EngineBlock(),      new Block(), undefined]
		]
	},

	/**
	 * This is the ship in the middle of the video
	 */
	starterShipSingleMisplacedEngine: function () {
		return [
			[undefined,           undefined,         new MiningLaserBlock(), undefined,         undefined],
			[undefined,           new Block(),       new Block(),            new Block(),       undefined],
			[undefined,           new Block(),       new ControlBlock(),     new Block(),       undefined],
			[undefined,           new Block(),       new PowerBlock(),       new Block(),       undefined],
			[new ThrusterBlock(), new Block(),       new CargoBlock,         new Block(),       new ThrusterBlock()],
			[undefined,           new Block(),       new CargoBlock,         new Block(),       undefined],
			[undefined,           new Block(),       new FuelBlock,          new Block(),       undefined],
			[undefined,           new Block(),       new EngineBlock(),      new Block(),       undefined],
			[undefined,           new EngineBlock(), undefined,              undefined,         undefined]
		]
	},

	/**
	 * This is the ship at the end of the video
	 */
	starterShipDoubleEngines: function () {
		return [
			[undefined,           undefined,         new MiningLaserBlock(), undefined,         undefined],
			[undefined,           new Block(),       new Block(),            new Block(),       undefined],
			[undefined,           new Block(),       new ControlBlock(),     new Block(),       undefined],
			[undefined,           new Block(),       new PowerBlock(),       new Block(),       undefined],
			[new ThrusterBlock(), new Block(),       new CargoBlock,         new Block(),       new ThrusterBlock()],
			[undefined,           new Block(),       new CargoBlock,         new Block(),       undefined],
			[undefined,           new Block(),       new FuelBlock,          new Block(),       undefined],
			[undefined,           new Block(),       undefined,              new Block(),       undefined],
			[undefined,           new EngineBlock(), undefined,              new EngineBlock(), undefined]
		]
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ExampleShips; }
