var Descriptions = {};

/* === BLOCKS === */
Descriptions[Block.prototype.classId()] =
{
	text: 'A basic block with no special properties.'
};

/* === ARMOR BLOCKS === */
Descriptions[Armor.prototype.classId()] =
{
	text: 'An armor block. Useful for protecting important parts of your ship.'
};

Descriptions[AdamantiumBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + ' Provides extra defense against cats.'
};

Descriptions[CloakBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[CloakBlockLight.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[CloakBlockVioletLight.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[DragonBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Provides extra defense against fire."
};

Descriptions[HullBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + ""
};

Descriptions[KryptoniteBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Provides extra defense against super-humans."
};

Descriptions[MithrilBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " There was once a myth about this block. But you've forgotten what it was."
};

Descriptions[OrangeBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " No one knows why this block is orange."
};

Descriptions[TitaniumBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Not only that, it sells for over $1k per kg on the open market."
};

Descriptions[VioletBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Very purple. Very very purple."
};


/* === Elements === */
Descriptions[Element.prototype.classId()] =
{
	text: 'An element block with no special properties (yet). Use these to shield your ship or to decorate your ship with ' +
		'interesting colors and patterns.'
};

Descriptions[CarbonBlock.prototype.classId()] =
{
	text: "Carbon comes from decayed organic matter. It's an important reactant for making many common ship parts."
};

Descriptions[CobaltBlock.prototype.classId()] =
{
	text: "Cobalt is natually found in many asteroids. It has been used as a blue pigment since ancient times, and has recently been used to tint metals and glass." +
		" Use Cobalt to shield your ship or to decorate your ship with interesting colors and patterns."
};

Descriptions[FluorineBlock.prototype.classId()] =
{
	text: "Fluorine occurs natually in many toothpastes and mouth rinses. It's use is still not well understood."+
		" Use Fluorine to shield your ship or to decorate your ship with interesting colors and patterns."
};

Descriptions[GoldBlock.prototype.classId()] =
{
	text: "Gold is one of the best natually-occurring conductors. Gold is an important reactant for many electronics including lasers."
};

Descriptions[IceBlock.prototype.classId()] =
{
	text: "Ice is one of the only sources of water in the cold of space."
};

Descriptions[IronBlock.prototype.classId()] =
{
	text: "Iron is the primary component of most asteroids. It is also the basic metal out of which many basic ship-parts are created."
};

/* === === */
Descriptions[Part.prototype.classId()] =
{
	text: 'A ship part block with no special properties (yet).'
};

Descriptions[CargoBlock.prototype.classId()] =
{
	text: "Cargo doesn't currently do anything."
};

Descriptions[ControlBlock.prototype.classId()] =
{
	text: "Control doesn't currently do anything."
};

Descriptions[EngineBlock.prototype.classId()] =
{
	text: 'Engines allow your ship to move forward and backwards. The more engines your ship has, the faster ' +
		'it will move. If you have no engines, your ship cannot move forward or backwards. As you place more blocks '+
		'on your ship, your ship will become heavier and you will need more Engines in order to fly at the same ' +
		'speed as before. Additionally, if you place engines on your ship in a lopsided manner, your ship will not ' +
		'fly straight.'
};

Descriptions[FuelBlock.prototype.classId()] =
{
	text: "Fuel doesn't currently do anything."
};

Descriptions[PowerBlock.prototype.classId()] =
{
	text: "Power doesn't currently do anything."
};

Descriptions[ThrusterBlock.prototype.classId()] =
{
	text: 'Thrusters allow your ship to rotate left and right. The more thrusters your ship has, the faster ' +
		'it can rotate. If you have no thrusters, your ship cannot rotate. As you place more blocks on your ship, ' +
		'your ship will become heavier and you will need more thrusters in order to rotate at the same speed as ' +
		'before.'
};

/* === WEAPONS === */
Descriptions[Weapon.prototype.classId()] =
{
	text: 'A weapon block which can deal damage to other blocks.'
};

Descriptions[MiningLaserBlock.prototype.classId()] =
{
	text: 'The mining laser is the most basic weapon in the game. Use it to break blocks off of structures ' +
		'and ships. If you lose your mining laser, you will not be able to shoot. Having more mining lasers will ' +
		'increase your mining speed.'
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Descriptions
}
