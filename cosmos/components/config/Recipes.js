var Recipes = {};

Recipes[EngineBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: IceBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

Recipes[ThrusterBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: IceBlock.prototype.classId(),
			quantity: 3
		}
	],
	equipment: []
};

Recipes[MiningLaserBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: GoldBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Recipes; }
