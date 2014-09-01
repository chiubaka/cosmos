var DamageSource = TLStreamedEntityComponent.extend({
	classId: 'DamageSource',
	componentId: 'damageSource',

	cooldown: undefined,
	damage: undefined,
	duration: undefined,
	durationFired: undefined,
	_isFiring: undefined,
	_coolingDown: undefined,
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
			isFiring: this.isFiringClient,
			target: this.targetClient
		};

		this.cooldown = data.cooldown;
		this.damage = data.damage;
		this.duration = data.duration;
		this.range = data.range;

		this.durationFired = 0;
		this._isFiring = false;
		this._coolingDown = false;
	},

	coolingDown: function(newVal) {
		if (newVal) {
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

	isFiring: function(newVal) {
		if (newVal) {
			this._isFiring = newVal;
			return this;
		}

		return this._isFiring;
	},

	isFiringClient: function(action) {
		this.isFiring(action.data);
	},

	isFiringServer: function(newVal) {
		this.isFiring(newVal);
		this.pushAction("isFiring", this._isFiring);
	},

	target: function(newTarget) {
		if (newTarget) {
			this._target = newTarget;
			return this;
		}

		return this._target;
	},

	targetClient: function(action) {
		this.target(action.data);
	},

	targetServer: function(newTarget) {
		this.target(newTarget);
		this.pushAction("target", this._target);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DamageSource; }
