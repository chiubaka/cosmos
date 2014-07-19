var Recipes = {};




/* === PARTS === */

/* === Engines === */

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

Recipes[SteelEngineBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: SteelBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: SteelPlatingBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 3
		}
	],
	equipment: []
};

Recipes[DragonBreathEngineBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: DragonBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: IceBlock.prototype.classId(),
			quantity: 3
		}
	],
	equipment: []
};

/* === Thrusters === */

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

Recipes[SteelThrusterBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: SteelBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: GoldBlock.prototype.classId(),
			quantity: 1
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
			blockType: KryptonitePlatingBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

/* === Weapons === */

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

/* === Armor === */

Recipes[MythrilPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: RefinedMythrilBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 2
		},
		{
			blockType: FluorineBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

Recipes[AdamantiumPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: AdamantiumBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 2
		},
		{
			blockType: IceBlock.prototype.classId(),
			quantity: 10
		}
	],
	equipment: []
};

Recipes[SteelPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: SteelBlock.prototype.classId(),
			quantity: 4
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 2
		}
	],
	equipment: []
};






/* === RESOURES === */

/* === Refined Elements === */

Recipes[RefinedMythrilBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: MythrilBlock.prototype.classId(),
			quantity: 3
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

Recipes[SteelBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 3
		}
	],
	equipment: []
};



if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Recipes; }
