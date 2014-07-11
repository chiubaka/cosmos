var Thrusts = {};

Thrusts[IronEngineBlock.prototype.classId()] =
{
	value: 3
};

Thrusts[DragonBreathEngineBlock.prototype.classId()] =
{
	value: 6
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Thrusts }