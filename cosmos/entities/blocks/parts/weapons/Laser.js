var Laser = Weapon.extend({
	classId: 'Laser',

	init: function(data) {
		Weapon.prototype.init.call(this, data);
	},

	firingUpdate: function() {
		console.log("Laser#firingUpdate");

		if (!this.damageSource.isFiring) {
			this.log("Laser#firingUpdate: called on a non-firing weapon.", "error");
		}

		var laserLoc = this.worldCoordinates();
		if (!laserLoc) {
			this.log("Laser#firingUpdate: error getting world coordinates of laser.", "error");
		}

		// TODO: Constrain ray cast to a point inside the range of the laser.
		var targetLoc = this.damageSource.target;

		var delta = {x: targetLoc.x - laserLoc.x, y: targetLoc.y - laserLoc.y};
		var distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
		var theta = Math.atan2(delta.y, delta.x);

		console.log("Laser loc: ");
		console.log(laserLoc);

		console.log("Target loc:");
		console.log(targetLoc);

		var inRangeLoc = {
			x: this.damageSource.range * Math.acos(theta) + laserLoc.x,
			y: this.damageSource.range * Math.asin(theta) + laserLoc.y
		};

		console.log("In range loc: ");
		console.log(inRangeLoc);

		var opts = {
			point1X: laserLoc.x,
			point1Y: laserLoc.y,
			point2X: inRangeLoc.x,
			point2Y: inRangeLoc.y,
			ignoreBodyIds: [this.gridData.grid.id()],
			ignoreBodyCategories: [Drop.BOX2D_CATEGORY]
		};

		var self = this;
		ige.physicsSystem.newRayCast(opts, function(data) {
			var intersectionPoint = inRangeLoc;
			var hitBlock = null;

			_.forEach(data, function(intersected) {
				hitBlock = intersected.entity;
				if (!(hitBlock instanceof Block)) {
					self.log("Weapon#firingUpdate: received non-Block entity from ray cast: " +
						hitBlock.classId(), "error");
				}

				if (hitBlock.health.value > 0) {
					// Continue
					return;
				}

				intersectionPoint.x = intersected.pointX;
				intersectionPoint.y = intersected.pointY;

				// Stop the loop early
				return false;
			});

			if (hitBlock) {
				// TODO: Change health on client
				hitBlock.takeDamage(self.damageSource.damage
					* Constants.UPDATE_TIME.SERVER / self.damageSource.duration,
					self.gridData.grid.player());
			}

			/* Increment duration fired/ */
			self.damageSource.durationFired += Constants.UPDATE_TIME.SERVER;

			/* If we have fired for as long as we were supposed to, shut off the weapon. */
			if (self.damageSource.durationFired > self.damageSource.duration) {
				self.damageSource.isFiring = false;
				//self.damageSource.onCooldown = true;
				// TODO: Start cooldown timer.

				self.gridData.grid.firingWeapons()
					.splice(self.gridData.grid.firingWeapons().indexOf(this), 1);

				ige.network.send("cosmos:Laser.render.stop", {id: self.id()});
			}
			else {
				// TODO: Send the client information about how to render the laser
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

		console.log("Laser#fireClient");

		ige.network.send('cosmos:Weapon.fire', data);
	},

	fireServer: function(data) {
		/* Validate whether or not this weapon can fire */
		// Cannot fire if already firing
		if (this.damageSource.isFiring) {
			return;
		}

		// Cannot fire while on cooldown
		if (this.damageSource.onCooldown) {
			return;
		}

		this.damageSource.durationFired = 0;
		this.damageSource.isFiring = true;
		this.damageSource.target = data.targetLoc;
		this.gridData.grid.firingWeapons().push(this);

		console.log("Laser#fireServer: end");
	}
});

Laser.onRender = function(data) {
	var laser = ige.$(data.id);
	if (!laser) {
		console.error("Laser#onRender: invalid laser id: " + data.id);
	}

	console.log("Laser#onRender");
};

Laser.onRenderStop = function(data) {
	var laser = ige.$(data.id);
	if (!laser) {
		console.error("Laser#onRenderStop: invalid laser id: " + data.id);
	}

	console.log("Laser#onRenderStop");
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Laser;
}
