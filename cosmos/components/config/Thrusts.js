var Thrusts = {};

var BASE_ENGINE_POWER = 0.01;
Thrusts[IronEngineBlock.prototype.classId()] =
{
	value: 1 * BASE_ENGINE_POWER
};

Thrusts[SteelEngineBlock.prototype.classId()] =
{
	value: 2 * BASE_ENGINE_POWER
};

Thrusts[DragonBreathEngineBlock.prototype.classId()] =
{
	value: 3 * BASE_ENGINE_POWER
};

var BASE_THRUST_POWER = 0.004;
Thrusts[IronThrusterBlock.prototype.classId()] =
{
	value: 1 * BASE_THRUST_POWER
};

Thrusts[SteelThrusterBlock.prototype.classId()] =
{
	value: 2 * BASE_THRUST_POWER
};

Thrusts[KryptoniteThrusterBlock.prototype.classId()] =
{
	value: 3 * BASE_THRUST_POWER
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Thrusts }
