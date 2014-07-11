var Recipes = {};

/* === PARTS === */

/* Engines */

Recipes[IronEngineBlock.prototype.classId()] =
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

Recipes[DragonBreathEngineBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronEngineBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: DragonBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

/* Thrusters */

Recipes[IronThrusterBlock.prototype.classId()] =
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

Recipes[KryptoniteThrusterBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronThrusterBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: KryptoniteBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

/* Weapons */

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
