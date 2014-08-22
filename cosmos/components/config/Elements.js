var Elements = {};

// TODO: textureBackground and textureOutline are legacy so that IGE texture rendering continues
// to work. This will be removed soon.
Elements[AdamantiumBlock.prototype.classId()] = {
	backgroundColor: 0x0E8118,
	borderColor: 0x146414,
	textureBackground: "rgb(14, 129, 24)",
	textureOutline: "rgb(20, 100, 20)"
};

Elements[CarbonBlock.prototype.classId()] = {
	backgroundColor: 0x282828,
	borderColor: 0x505050,
	textureBackground: "rgb(40, 40, 40)",
	textureOutline: "rgb(80, 80, 80)"
};

Elements[CobaltBlock.prototype.classId()] = {
	backgroundColor: 0x0047AB,
	borderColor: 0x000080,
	textureBackground: "rgb(0, 71, 171)",
	textureOutline: "rgb(0, 0, 128)"
};

Elements[DragonBlock.prototype.classId()] = {
	backgroundColor: 0x770000,
	borderColor: 0x780000,
	textureBackground: "rgb(119, 0, 0)",
	textureOutline: "rgb(120, 0, 0)"
};

Elements[FluorineBlock.prototype.classId()] = {
	backgroundColor: 0x551A8C,
	borderColor: 0x262626,
	textureBackground: "rgb(85, 26, 140)",
	textureOutline: "rgb(38, 38, 38)"
};

Elements[GoldBlock.prototype.classId()] = {
	backgroundColor: 0xFFD700,
	borderColor: 0xDAA520,
	textureBackground: "rgb(255,215,0)",
	textureOutline: "rgb(218,165,32)"
};

Elements[IceBlock.prototype.classId()] = {
	backgroundColor: 0x3FAFDD,
	borderColor: 0x81CEE2,
	backgroundAlpha: 0.3,
	textureBackground: "rgba(63, 175, 221, 0.3)",
	textureOutline: "rgb(129, 206, 226)"
};

Elements[IronBlock.prototype.classId()] = {
	backgroundColor: 0x646464,
	borderColor: 0x6E6E6E,
	textureBackground: "rgb(100, 100, 100)",
	textureOutline: "rgb(110, 110, 110)"
};

Elements[KryptoniteBlock.prototype.classId()] = {
	backgroundColor: 0x9FF500,
	borderColor: 0x6FA700,
	backgroundAlpha: 0.8,
	textureBackground: "rgba(159, 245, 0, 0.8)",
	textureOutline: "rgb(111, 167, 0)"
};

Elements[MythrilBlock.prototype.classId()] = {
	backgroundColor: 0xC8C8FF,
	borderColor: 0xD2D2FF,
	textureBackground: "rgb(200, 200, 255)",
	textureOutline: "rgb(210, 210, 255)"
};

Elements[SteelBlock.prototype.classId()] = {
	backgroundColor: 0xA0A0A0,
	borderColor: 0x505050,
	textureBackground: "rgb(160, 160, 160)",
	textureOutline: "rgb(80, 80, 80)"
};

Elements[TitaniumBlock.prototype.classId()] = {
	backgroundColor: 0xDCDCDC,
	borderColor: 0xC8C8C8,
	textureBackground: "rgb(220, 220, 220)",
	textureOutline: "rgb(200, 200, 200)"
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Elements;
}
