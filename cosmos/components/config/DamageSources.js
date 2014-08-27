var DamageSources = {};

DamageSources[MiningLaserBlock.prototype.classId()] = {
	cooldown: 1000,
	damage: 20,
	duration: 2000,
	range: 1000
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DamageSources;
}
