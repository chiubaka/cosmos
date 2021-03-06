var Laser = Weapon.extend({
	classId: 'Laser',

	_rayCastId: undefined,

	init: function(data) {
		Weapon.prototype.init.call(this, data);
	},

	firingUpdate: function() {
		if (!this.damageSource.target()) {
			// TOOD: This case is being hit. Figure out why and fix it, because this should never
			// happen.
			this.log("Laser#firingUpdate: called on a non-firing weapon.", "warning");
			return
		}

		var laserLoc = this.worldCoordinates();
		if (!laserLoc) {
			this.log("Laser#firingUpdate: error getting world coordinates of laser.", "error");
		}

		var targetLoc = this.damageSource.target();

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
		var rayCastId = this._rayCastId = ige.physicsSystem.newRayCast(opts, function(data) {
			// If the stored rayCastId doesn't match the instance's rayCastId, this block was
			// probably removed. This needs to be dealt with because the rayCast system has an
			// asynchronous callback. Between when we ask for the rayCast and when we receive the
			// results, the block that requested the rayCast may have been removed or modified in
			// some meaningful way.
			if (rayCastId !== self._rayCastId) {
				return;
			}

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

				hitBlock.takeDamage(damage, self.gridData.grid.player());
			}

			self.damageSource.intersectionPointServer(intersectionPoint);

			/* Increment duration fired/ */
			self.damageSource.durationFired += Constants.UPDATE_TIME.SERVER;

			/* If we have fired for as long as we were supposed to, shut off the weapon. */
			if (self.damageSource.durationFired >= self.damageSource.duration) {
				self.stopFiring();

				self.damageSource.coolingDown(true);
				setTimeout(function() {
					self.damageSource.coolingDown(false);
				}, self.damageSource.cooldown);
			}
			else {
				var renderData = {
					id: self.id(),
					targetLoc: intersectionPoint,
					normal: {x: data.normalX, y: data.normalY}
				};
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
		// Cannot fire while on cooldown.
		// Must check whether or not this block is part of a Ship because there are race conditions
		// where one client sends a message to have a laser fire, but before that message reaches
		// the server the laser is destroyed and placed in a drop. At that point, the grid of the
		// laser is not a ship, which would otherwise crash the server without this check.
		if (this.damageSource.coolingDown() || !(this.blockGrid() instanceof Ship)) {
			return;
		}

		// If already firing, duration will not reset. This way a player can only fire for the
		// laser's duration, but can retarget during that duration.
		if (!this.damageSource.target()) {
			this.damageSource.durationFired = 0;
			this.gridData.grid.firingWeapons().push(this);
		}

		this.damageSource.target(data.targetLoc);
	},

	onRemove: function() {
		Weapon.prototype.onRemove.call(this);

		if (ige.isServer && this.damageSource.target()) {
			this.stopFiring();
		}
	},

	stopFiring: function() {
		this.damageSource.target(null);
		this.damageSource.intersectionPointServer(null);
		this._rayCastId = undefined;

		var firingWeapons = this.blockGrid().firingWeapons();
		firingWeapons.splice(firingWeapons.indexOf(this), 1);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Laser;
}
