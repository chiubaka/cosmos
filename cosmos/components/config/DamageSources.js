var DamageSources = {};

/*
The red laser is the most basic weapon in the game right now
*/
DamageSources[RedLaserBlock.prototype.classId()] = {
	cooldown: 2000,
	damage: 20,
	duration: 2000,
	range: 1000
};

/*
The green laser does more damage and slightly greater
range than the red laser
*/
DamageSources[GreenLaserBlock.prototype.classId()] = {
	cooldown: 2000,
	damage: 40,
	duration: 2000,
	range: 1500
};

/*
The purple laser has a faster cooldown and a slightly greater
range than the green laser
*/
DamageSources[PurpleLaserBlock.prototype.classId()] = {
	cooldown: 1500,
	damage: 60,
	duration: 2000,
	range: 2000
};

/*
The doom lasers has a huge range and damage but a very large reload time.
It is not craftable at the moment.
*/
DamageSources[DoomLaserBlock.prototype.classId()] = {
	cooldown: 20000,
	damage: 20000,
	duration: 2000,
	range: 10000
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DamageSources;
}
