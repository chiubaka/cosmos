var Recipes = {};




/* === PARTS === */

/* === Engines === */

Recipes[IronEngineBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 2
		},
		{
			blockType: IceBlock.prototype.classId(),
			quantity: 2
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
			quantity: 1
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
			quantity: 2
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
			quantity: 2
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

Recipes[MythrilPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: KryptonitePlatingBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: MythrilBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

Recipes[AdamantiumPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: MythrilPlatingBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: AdamantiumBlock.prototype.classId(),
			quantity: 1
		}
	],
	equipment: []
};

Recipes[DragonPlatingBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: AdamantiumPlatingBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: GoldBlock.prototype.classId(),
			quantity: 10
		},
		{
			blockType: DragonBlock.prototype.classId(),
			quantity: 3
		}
	],
	equipment: []
};



/* === Weapons === */
// LVL 1 Laser
Recipes[RedLaserBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: IronBlock.prototype.classId(),
			quantity: 2
		},
		{
			blockType: GoldBlock.prototype.classId(),
			quantity: 2
		}
	],
	equipment: []
};

// LVL 2 laser
Recipes[GreenLaserBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: RedLaserBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: KryptoniteBlock.prototype.classId(),
			quantity: 3
		}
	],
	equipment: []
};

// LVL 3 Laser
Recipes[PurpleLaserBlock.prototype.classId()] =
{
	reactants: [
		{
			blockType: GreenLaserBlock.prototype.classId(),
			quantity: 1
		},
		{
			blockType: FluorineBlock.prototype.classId(),
			quantity: 10
		}
	],
	equipment: []
};





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
