var DamageSource = TLStreamedEntityComponent.extend({
	classId: 'DamageSource',
	componentId: 'damageSource',

	cooldown: undefined,
	_coolingDown: undefined,
	damage: undefined,
	duration: undefined,
	durationFired: undefined,
	_intersectionPoint: undefined,
	range: undefined,
	_target: undefined,

	init: function(entity, data) {
		if (data === undefined || data.cooldown === undefined || data.damage === undefined
			|| data.duration === undefined || data.range === undefined ) {
			this.log('Init parameters not provided for DamageSource.', 'error');
			return;
		}

		TLStreamedEntityComponent.prototype.init.call(this, entity, data);

		this._actionCallbacks = {
			intersectionPoint: this.intersectionPointClient
		};

		this.cooldown = data.cooldown;
		this.damage = data.damage;
		this.duration = data.duration;
		this.range = data.range;

		this.durationFired = 0;
		this._intersectionPoint = null;
		this._coolingDown = false;
	},

	coolingDown: function(newVal) {
		if (newVal !== undefined) {
			this._coolingDown = newVal;
			return this;
		}
		return this._coolingDown;
	},

	intersectionPoint: function(newPoint) {
		if (newPoint !== undefined) {
			this._intersectionPoint = newPoint;
			return this;
		}

		return this._intersectionPoint;
	},

	// TODO: For now, the DamageSource makes assumptions about the type of weapon. This should be
	// changed when there are multiple types of weapons in the game.
	intersectionPointClient: function(action) {
		this.intersectionPoint(action.data);
		var laser = this._entity;

		if (this._intersectionPoint) {
			if (laser.laserBeam === undefined) {
				laser.laserBeam = new LaserBeam({source: laser})
					.setTarget(action.data.x, action.data.y);

				laser._mountEffect(laser.laserBeam, true);
			}
			else {
				laser.laserBeam.setTarget(action.data.x, action.data.y);
			}
		}
		else {
			laser.laserBeam.destroy();
			laser.laserBeam = undefined;

			// Laser stopped firing. Start cooldown timer on client.
			var ship = this._entity.blockGrid();
			if (ship === ige.client.player.currentShip()) {
				ige.hud.bottomToolbar.capBar.mineCap.startCooldown(this._entity);
			}
		}
	},

	intersectionPointServer: function(newPoint) {
		this.intersectionPoint(newPoint);
		this.pushAction("intersectionPoint", newPoint);
	},

	target: function(newTarget) {
		if (newTarget !== undefined) {
			this._target = newTarget;
			return this;
		}

		return this._target;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DamageSource; }
