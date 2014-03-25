var ExampleShips = {
	/**
	This is the ship in the video
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
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ExampleShips; }
