var Types = {};

/* === BLOCKS === */
Types[Block.prototype.classId()] =
{
	text: 'Block'
};

/* === ARMOR BLOCKS === */
Types[Armor.prototype.classId()] =
{
	text: 'Armor'
};

Types[CloakBlock.prototype.classId()] =
{
	text: "Cloaking Armor"
};

Types[CloakBlockLight.prototype.classId()] =
{
	text: "Cloaking Armor"
};

Types[CloakBlockViolet.prototype.classId()] =
{
	text: "Cloaking Armor"
};

Types[CloakBlockVioletLight.prototype.classId()] =
{
	text: "Cloaking Armor"
};

Types[IronPlatingBlock.prototype.classId()] =
{
	text: "Level 1 Armor"
};

Types[SteelPlatingBlock.prototype.classId()] =
{
	text: "Level 2 Armor"
};

Types[KryptonitePlatingBlock.prototype.classId()] =
{
	text: "Level 3 Armor"
};

Types[MythrilPlatingBlock.prototype.classId()] =
{
	text: "Level 4 Armor"
};

Types[AdamantiumPlatingBlock.prototype.classId()] =
{
	text: "Level 5 Armor"
};

Types[DragonPlatingBlock.prototype.classId()] =
{
	text: "Level 6 Armor"
};

Types[TitaniumPlatingBlock.prototype.classId()] =
{
	text: "Level 3 Armor"
};






/* === Elements === */
Types[Element.prototype.classId()] =
{
	text: "Resource"
};

Types[CarbonBlock.prototype.classId()] =
{
	text: "Basic Resource"
};

Types[CobaltBlock.prototype.classId()] =
{
	text: "Colorant"
};

Types[FluorineBlock.prototype.classId()] =
{
	text: "Advanced Resource"
};

Types[GoldBlock.prototype.classId()] =
{
	text: "Rare Metal"
};

Types[IceBlock.prototype.classId()] =
{
	text: "Basic Resource"
};

Types[IronBlock.prototype.classId()] =
{
	text: "Basic Metal"
};

Types[DragonBlock.prototype.classId()] =
{
	text: "Rare Metal"
};

Types[AdamantiumBlock.prototype.classId()] =
{
	text: "Rare Metal"
};


Types[KryptoniteBlock.prototype.classId()] =
{
	text: "Rare Metal"
};

Types[SteelBlock.prototype.classId()] =
{
	text: "Metal Alloy"
};

Types[TitaniumBlock.prototype.classId()] =
{
	text: "Rare Metal"
};

Types[MythrilBlock.prototype.classId()] =
{
	text: "Rare Metal"
};

Types[RefinedMythrilBlock.prototype.classId()] =
{
	text: "Refined Metal"
};






/* === Parts === */
Types[Part.prototype.classId()] =
{
	text: "Ship Part"
};

Types[CargoBlock.prototype.classId()] =
{
	text: "Cargo Hold"
};

Types[BridgeBlock.prototype.classId()] =
{
	text: "Command Center"
};

/* Engines */
Types[IronEngineBlock.prototype.classId()] =
{
	text: "Level 1 Engine"
};

Types[SteelEngineBlock.prototype.classId()] =
{
	text: "Level 2 Engine"
};

Types[DragonBreathEngineBlock.prototype.classId()] =
{
	text: 'Level 3 Engine'
};


Types[FuelBlock.prototype.classId()] =
{
	text: "Fuel"
};

Types[PowerBlock.prototype.classId()] =
{
	text: "Power"
};

/* Thrusters */
Types[IronThrusterBlock.prototype.classId()] =
{
	text: 'Level 1 Thruster'
};

Types[SteelThrusterBlock.prototype.classId()] =
{
	text: "Level 2 Thruster"
};

Types[KryptoniteThrusterBlock.prototype.classId()] =
{
	text: "Level 3 Thruster"
};

/* === WEAPONS === */
Types[Weapon.prototype.classId()] =
{
	text: 'Weapon'
};

Types[MiningLaserBlock.prototype.classId()] =
{
	text: 'Level 1 Laser'
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Types
}
