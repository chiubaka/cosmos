/*
Note that all weapons have the same cooldown right now because
the controls for firing weapons don't yet take into account weapons
with different cooldowns in a reasonable way.
*/

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
The green laser does more damage and has a slightly greater
range than the red laser
*/
DamageSources[GreenLaserBlock.prototype.classId()] = {
	cooldown: 1000,
	damage: 60,
	duration: 2000,
	range: 800
};

/*
The purple laser does more damage
and has a slightly greater range than the green laser
*/
DamageSources[PurpleLaserBlock.prototype.classId()] = {
	cooldown: 1000,
	damage: 80,
	duration: 2000,
	range: 1000
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DamageSources;
}
