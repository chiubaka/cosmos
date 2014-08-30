var Laser = Weapon.extend({
	classId: 'Laser',

	init: function(data) {
		Weapon.prototype.init.call(this, data);
	},

	firingUpdate: function() {
		if (!this.damageSource.isFiring) {
			// TOOD: This case is being hit. Figure out why and fix it, because this should never
			// happen.
			this.log("Laser#firingUpdate: called on a non-firing weapon.", "warning");
			return
		}

		var laserLoc = this.worldCoordinates();
		if (!laserLoc) {
			this.log("Laser#firingUpdate: error getting world coordinates of laser.", "error");
		}

		var targetLoc = this.damageSource.target;

		var delta = {x: targetLoc.x - laserLoc.x, y: targetLoc.y - laserLoc.y};
		var theta = Math.atan2(delta.y, delta.x);

		var inRangeLoc = {
			x: this.damageSource.range * Math.cos(theta) + laserLoc.x,
			y: this.damageSource.range * Math.sin(theta) + laserLoc.y
		};

		var opts = {
			point1X: laserLoc.x,
			point1Y: laserLoc.y,
			point2X: inRangeLoc.x,
			point2Y: inRangeLoc.y,
			ignoreBodyIds: [this.gridData.grid.id()],
			ignoreFixtureIds: [],
			ignoreFixtureCategories: [Ship.ATTRACTOR_BOX2D_CATEGORY_BITS,
				Drop.BOX2D_CATEGORY_BITS]
		};

		var self = this;
		ige.physicsSystem.newRayCast(opts, function(data) {
			var intersectionPoint = {x: inRangeLoc.x, y: inRangeLoc.y};
			var hitBlock = null;

			_.forEach(data, function(intersected) {
				hitBlock = intersected.entity;
				if (!(hitBlock instanceof Block)) {
					self.log("Weapon#firingUpdate: received non-Block entity from ray cast: " +
						hitBlock.classId(), "error");
				}

				// Must check if grid is defined here. Theory is that the game server removes the
				// block from the grid then makes a request to the Physics Server to destroy the
				// associated fixture. Before the physics server destroys the fixture, it returns
				// that fixture as a raycast intersection resulting in a block here that is not
				// actually in a grid anymore.
				if (hitBlock.health.value <= 0 || !hitBlock.gridData.grid) {
					// Continue
					return;
				}

				intersectionPoint.x = intersected.pointX;
				intersectionPoint.y = intersected.pointY;

				// Stop the loop early
				return false;
			});

			if (hitBlock && hitBlock.gridData.grid) {
				var damage = self.damageSource.damage * Constants.UPDATE_TIME.SERVER
					/ self.damageSource.duration;

				ige.network.send("blockAction", {
					action: "damage",
					blockGridId: hitBlock.gridData.grid.id(),
					col: hitBlock.gridData.loc.x,
					row: hitBlock.gridData.loc.y,
					amount: damage
				});

				hitBlock.takeDamage(damage, self.gridData.grid.player());
			}

			/* Increment duration fired/ */
			self.damageSource.durationFired += Constants.UPDATE_TIME.SERVER;

			/* If we have fired for as long as we were supposed to, shut off the weapon. */
			if (self.damageSource.durationFired >= self.damageSource.duration) {
				self.gridData.grid.firingWeapons()
					.splice(self.gridData.grid.firingWeapons().indexOf(self), 1);
				self.damageSource.isFiring = false;

				ige.network.send("cosmos:Laser.render.stop", {id: self.id()});

				ige.network.send("cosmos:Weapon.cooldown.start", {id: self.id()},
					self.gridData.grid.player().clientId());
				self.damageSource.onCooldown = true;
				setTimeout(function() {
					self.damageSource.onCooldown = false;
				}, self.damageSource.cooldown);
			}
			else {
				var renderData = {
					id: self.id(),
					targetLoc: intersectionPoint,
					normal: {x: data.normalX, y: data.normalY}
				};

				ige.network.send("cosmos:Laser.render", renderData);
			}
		});
	},

	fireClient: function(targetLoc) {
		var data = {
			id: this.id(),
			targetLoc: targetLoc
		};

		ige.network.send('cosmos:Weapon.fire', data);
	},

	fireServer: function(data) {
		/* Validate whether or not this weapon can fire */
		// Cannot fire while on cooldown
		if (this.damageSource.onCooldown) {
			return;
		}

		// If already firing, duration will not reset. This way a player can only fire for the
		// laser's duration, but can retarget during that duration.
		if (!this.damageSource.isFiring) {
			this.damageSource.durationFired = 0;
			this.damageSource.isFiring = true;
			this.gridData.grid.firingWeapons().push(this);
		}

		this.damageSource.target = data.targetLoc;
	}
});

Laser.onRender = function(data) {
	var laser = ige.$(data.id);
	if (!laser) {
		// TODO: For now, messages can be received for lasers that don't exist because messages are
		// sent from the server to all clients. Uncomment this when there is some sort of stream
		// control in place.
		//console.error("Laser#onRender: invalid laser id: " + data.id);
		return;
	}

	if (laser.laserBeam === undefined) {
		laser.laserBeam = new LaserBeam()
			.setSource(laser)
			.setTarget(data.targetLoc.x, data.targetLoc.y);
		laser._mountEffect(laser.laserBeam, true);
	}
	else {
		laser.laserBeam.setTarget(data.targetLoc.x, data.targetLoc.y);
	}
};

Laser.onRenderStop = function(data) {
	var laser = ige.$(data.id);
	if (!laser) {
		// TODO: For now, messages can be received for lasers that don't exist because messages are
		// sent from the server to all clients. Uncomment this when there is some sort of stream
		// control in place.
		//console.error("Laser#onRenderStop: invalid laser id: " + data.id);
		return;
	}
	laser.laserBeam.destroy();
	delete laser.laserBeam;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Laser;
}
