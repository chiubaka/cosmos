var DamageSources = {};

/*
The red laser is the most basic weapon in the game right now
*/
DamageSources[RedLaserBlock.prototype.classId()] = {
	cooldown: 1000,
	damage: 40,
	duration: 2000,
	range: 600
};

/*
The green laser does more damage and slightly greater
range than the red laser
*/
DamageSources[GreenLaserBlock.prototype.classId()] = {
	cooldown: 1000,
	damage: 60,
	duration: 2000,
	range: 900
};

/*
The purple laser has a faster cooldown and a slightly greater
range than the green laser
*/
DamageSources[PurpleLaserBlock.prototype.classId()] = {
	cooldown: 1000,
	damage: 80,
	duration: 2000,
	range: 1200
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DamageSources;
}
