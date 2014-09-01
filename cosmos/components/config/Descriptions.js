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

Descriptions[AdamantiumPlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text
};

Descriptions[CloakBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[CloakBlockLight.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[CloakBlockViolet.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[CloakBlockVioletLight.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Doesn't actually cloak your ship."
};

Descriptions[DragonPlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Forged from the hide of a space-dragon. Provides extra defense against fire."
};

Descriptions[IronPlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + ""
};

Descriptions[KryptonitePlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Provides extra defense against super-humans."
};

Descriptions[MythrilPlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " There was once a myth about this block. But you've forgotten what it was."
};

Descriptions[SteelPlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text
};

Descriptions[TitaniumPlatingBlock.prototype.classId()] =
{
	text: Descriptions[Armor.prototype.classId()].text + " Not only that, it sells for over $1k per kg on the open market."
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

Descriptions[DragonBlock.prototype.classId()] =
{
	text: "The essential remains of space dragons. Dragon can be used to craft advanced engines and armor."
};

Descriptions[AdamantiumBlock.prototype.classId()] =
{
	text: "Wolverine's favorite element. Adamantium is an extremely strong metal."
};


Descriptions[KryptoniteBlock.prototype.classId()] =
{
	text: "Kryptonite is a not-yet-understood element that radiates a disruptive magnetic field. It can be used to craft advanced thrusters."
};

Descriptions[SteelBlock.prototype.classId()] =
{
	text: "Steel is tempered form of iron, strengthed by added carbon. Steel is a basic building block of many ship-parts."
};

Descriptions[TitaniumBlock.prototype.classId()] =
{
	text: "Titanium is one of the strongest metals known to man. It can be used to build advanced defense systems."
};

Descriptions[MythrilBlock.prototype.classId()] =
{
	text: "Mythril is a rare and strong metal."
};

Descriptions[RefinedMythrilBlock.prototype.classId()] =
{
	text: "Refined Mythril is ready to be crafted into useful ship-parts."
};






/* === Parts === */
Descriptions[Part.prototype.classId()] =
{
	text: 'A ship part block with no special properties (yet).'
};

Descriptions[CargoBlock.prototype.classId()] =
{
	text: "Cargo doesn't currently do anything."
};

Descriptions[BridgeBlock.prototype.classId()] =
{
	text: "The Bridge is the most important block in your ship. If you lose your bridge you'll have to get a new ship."
};

/* Engines */
Descriptions[IronEngineBlock.prototype.classId()] =
{
	text: 'Engines allow your ship to move forward and backwards. The more engines your ship has, the faster ' +
		'it will move. If you have no engines, your ship cannot move forward or backwards. As you place more blocks '+
		'on your ship, your ship will become heavier and you will need more Engines in order to fly at the same ' +
		'speed as before. Additionally, if you place engines on your ship in a lopsided manner, your ship will not ' +
		'fly straight.'
};

Descriptions[SteelEngineBlock.prototype.classId()] =
{
	text: "An engine with more strength and durability than the Iron Engine."
};

Descriptions[DragonBreathEngineBlock.prototype.classId()] =
{
	text: 'Forged from the remains of a space dragon, this engine is a significant improvement over the basic Iron ' +
		'Engine.'
};

Descriptions[FuelBlock.prototype.classId()] =
{
	text: "Fuel doesn't currently do anything."
};

Descriptions[PowerBlock.prototype.classId()] =
{
	text: "Power doesn't currently do anything."
};

/* Thrusters */
Descriptions[IronThrusterBlock.prototype.classId()] =
{
	text: 'Thrusters allow your ship to rotate left and right. The more thrusters your ship has, the faster ' +
		'it can rotate. If you have no thrusters, your ship cannot rotate. As you place more blocks on your ship, ' +
		'your ship will become heavier and you will need more thrusters in order to rotate at the same speed as ' +
		'before.'
};

Descriptions[SteelThrusterBlock.prototype.classId()] =
{
	text: "A thruster with more strength and durability than the Iron Thruster."
};

Descriptions[KryptoniteThrusterBlock.prototype.classId()] =
{
	text: "A thruster that moves so fast that even Super Man couldn't get away."
};

/* === WEAPONS === */
Descriptions[Weapon.prototype.classId()] =
{
	text: 'A weapon block which can deal damage to other blocks.'
};

Descriptions[RedLaserBlock.prototype.classId()] =
{
	text: 'This laser is the most basic weapon in the game. Use it to break blocks off of structures ' +
		'and ships. If you lose your laser, you will not be able to shoot.'
};
Descriptions[GreenLaserBlock.prototype.classId()] =
{
	text: 'This bright emerald-colored laser is more powerful than the Red Laser.'
};
Descriptions[PurpleLaserBlock.prototype.classId()] =
{
	text: 'This beautiful Amethyst-colored laser is one of the most powerful lasers known to man.' +
		'It can cut through meter-thick steel like a hot knife through butter.'
};
Descriptions[DoomLaserBlock.prototype.classId()] =
{
	text: 'This frightning black laser is a piece of ancient alien technology. ' +
		'Scientists theorize that the same principles that make this laser work ' +
		'could also be used to make planet-busting weapons.'
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Descriptions
}
