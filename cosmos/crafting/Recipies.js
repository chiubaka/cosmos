var Recipies = {
	// TODO: Make recipies into numbers to save bandwidth (like notifications)
	engine: {
		reactants: {IronBlock: 3, CarbonBlock: 3, IceBlock: 1},
		equipments: {},
		products: {EngineBlock: 1}
	},

	thruster: {
		reactants: {IronBlock: 3, CarbonBlock: 1, IceBlock: 3},
		equipments: {},
		products: {ThrusterBlock: 1}
	},

	miningLaser: {
		reactants: {IronBlock: 3, CarbonBlock: 1, GoldBlock: 1},
		equipments: {},
		products: {MiningLaserBlock: 1}
	},

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Recipies; }
