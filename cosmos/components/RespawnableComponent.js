var RespawnableComponent = IgeClass.extend({
	classId: 'RespawnableComponent',
	componentId: 'respawn',

	_entity: undefined,
	_respawnTime: undefined,
	_respawnAction: undefined,
	_respawnTimeout: undefined,

	init: function(entity, data) {
		var self = this;
		this._entity = entity;

		if (data === undefined || data.minRespawnTime === undefined || data.maxRespawnTime === undefined
			|| data.respawnAction === undefined) {
			this.log('Init parameters not provided for RespawnableComponent.', 'error');
			return;
		}

		this._respawnAction = data.respawnAction;

		this._respawnTime = Math.floor(Math.random() * data.maxRespawnTime) + data.minRespawnTime;
		this._respawnTimeout = setTimeout(function() {

			self._respawnAction();
			self._entity.destroy();
			self._entity.log('Respawning!');
		}, this._respawnTime);
	},

	resetTimeout: function() {
		var self = this;
		clearTimeout(this._respawnTimeout);
		this._respawnTimeout = setTimeout(function() {

			self._respawnAction();
			self._entity.destroy();
			self._entity.log('Respawning!');
		}, this._respawnTime);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = RespawnableComponent; }
