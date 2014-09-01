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
			coolingDown: this.coolingDownClient,
			intersectionPoint: this.intersectionPointClient,
			isFiring: this.isFiringClient,
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

	coolingDownClient: function(action) {
		this.coolingDown(action.data);
	},

	coolingDownServer: function(newVal) {
		this.coolingDown(newVal);
		this.pushAction("coolingDown", this._coolingDown);
	},

	intersectionPoint: function(newPoint) {
		if (newPoint !== undefined) {
			this._intersectionPoint = newPoint;
			return this;
		}

		return this._intersectionPoint;
	},

	intersectionPointClient: function(action) {
		this.intersectionPoint(action.data);
		var laser = this._entity;

		if (this._intersectionPoint) {
			if (laser.laserBeam === undefined) {
				laser.laserBeam = new LaserBeam()
					.setSource(laser)
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
