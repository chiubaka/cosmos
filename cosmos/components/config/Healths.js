var Healths = {};

/* === PARTS === */

Healths[CargoBlock.prototype.classId()] =
{
	max: 20
};

Healths[ControlBlock.prototype.classId()] =
{
	max: 45
};

Healths[FuelBlock.prototype.classId()] =
{
	max: 10
};

Healths[PowerBlock.prototype.classId()] =
{
	max: 40
};

Healths[ThrusterBlock.prototype.classId()] =
{
	max: 40
};

/* Armor */

Healths[AdamantiumBlock.prototype.classId()] =
{
	max: 60
};

Healths[CloakBlock.prototype.classId()] =
{
	max: 60
};

Healths[CloakBlockLight.prototype.classId()] =
{
	max: 60
};

Healths[CloakBlockViolet.prototype.classId()] =
{
	max: 60
};

Healths[CloakBlockVioletLight.prototype.classId()] =
{
	max: 60
};

Healths[DragonBlock.prototype.classId()] =
{
	max: 60
};

Healths[HullBlock.prototype.classId()] =
{
	max: 30
};

Healths[KryptoniteBlock.prototype.classId()] =
{
	max: 60
};

Healths[MithrilBlock.prototype.classId()] =
{
	max: 60
};

Healths[OrangeBlock.prototype.classId()] =
{
	max: 60
};

Healths[TitaniumBlock.prototype.classId()] =
{
	max: 60
};

Healths[VioletBlock.prototype.classId()] =
{
	max: 60
};

/* Engines */
Healths[IronEngineBlock.prototype.classId()] =
{
	max: 40
};

Healths[DragonBreathEngineBlock.prototype.classId()] =
{
	max: 40
};

/* Weapons */

Healths[MiningLaserBlock.prototype.classId()] =
{
	max: 50
};

/* === ELEMENTS === */

Healths[CarbonBlock.prototype.classId()] =
{
	max: 15
};

Healths[CobaltBlock.prototype.classId()] =
{
	max: 60
};

Healths[FluorineBlock.prototype.classId()] =
{
	max: 50
};

Healths[GoldBlock.prototype.classId()] =
{
	max: 50
};

Healths[IceBlock.prototype.classId()] =
{
	max: 8
};

Healths[IronBlock.prototype.classId()] =
{
	max: 25
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Healths; }
