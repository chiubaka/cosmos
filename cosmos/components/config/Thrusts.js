var Thrusts = {};

Thrusts[IronEngineBlock.prototype.classId()] =
{
	value: 3
};

Thrusts[SteelEngineBlock.prototype.classId()] =
{
	value: 6
};

Thrusts[DragonBreathEngineBlock.prototype.classId()] =
{
	value: 9
};

Thrusts[IronThrusterBlock.prototype.classId()] =
{
	value: 60
};

Thrusts[SteelThrusterBlock.prototype.classId()] =
{
	value: 120
};

Thrusts[KryptoniteThrusterBlock.prototype.classId()] =
{
	value: 180
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Thrusts }
