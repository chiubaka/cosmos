var Recipies = {

	starterRecipies: [
		{
			name: "Engine",
			reactants:{IronBlock: 3, CarbonBlock: 3, IceBlock: 1},
			equipment:{},
			products:{EngineBlock: 1}
		},
		{
			name: "Mining Laser",
			reactants:{IronBlock: 3, CarbonBlock: 1, GoldBlock: 1},
			equipment:{},
			products:{MiningLaser: 1}
		},
	],

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Recipies; }
