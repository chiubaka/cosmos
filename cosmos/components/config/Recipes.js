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
			blockType: IronEngineBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: SteelBlock.prototype.classId(),
			quantity: 2
		}
	],
	equipment: []
};

Recipes[DragonBreathEngineBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: SteelEngineBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: DragonBlock.prototype.classId(),
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
			blockType: IronThrusterBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: SteelBlock.prototype.classId(),
			quantity: 2
		}
	],
	equipment: []
};

Recipes[KryptoniteThrusterBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: SteelThrusterBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: KryptoniteBlock.prototype.classId(),
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

Recipes[IronPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 2
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

Recipes[SteelPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronPlatingBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: SteelBlock.prototype.classId(),
			quantity: 1
		},
	],
	equipment: []
};

Recipes[KryptonitePlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: SteelPlatingBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: KryptoniteBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};
/*
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
*//*
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
*/





/* === RESOURES === */

/* === Refined Elements === */
/*
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
*/
Recipes[SteelBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: CarbonBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};



if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Recipes; }
