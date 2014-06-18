var NotificationComponent = IgeEventingClass.extend({
	classId: 'NotificationComponent',
	componentId: 'notification',
	self: undefined,
	_infoHandler: undefined,
	_errorHandler: undefined,
	_successHandler: undefined,

	init: function (entity, options) {

		if (ige.isServer) {
			ige.network.define('notificationInfo');
			ige.network.define('notificationError');
			ige.network.define('notificationSuccess');
		}


		if (ige.isClient) {
			this._queuedInfos = [];
			this._queuedErrors = [];
			this._queuedSuccesses = [];

			// Register client notifications
			this.on('notificationInfo', this._onNotificationInfo);
			this.on('notificationError', this._onNotificationError);
			this.on('notificationSuccess', this._onNotificationSuccess);

			// Register server notifications
			ige.network.define('notificationInfo', this._onNotificationInfo);
			ige.network.define('notificationError', this._onNotificationError);
			ige.network.define('notificationSuccess', this._onNotificationSuccess);
			self = this;
		}

		this.log('Notification component initiated!');
	},

	start: function () {
		if (!this._active) {
			this._active = true;
			ige.addBehaviour('notificationStep', this._behaviour);
		}
	},

	stop: function () {
		if (this._active) {
			this._active = false;
			ige.removeBehaviour('notificationStep');
		}
	},

	registerInfoHandler: function (handler) {
		this._infoHandler = handler;
		return this;
	},

	registerErrorHandler: function (handler) {
		this._errorHandler = handler;
		return this;
	},

	registerSuccessHandler: function (handler) {
		this._successHandler = handler;
		return this;
	},


	unRegisterInfoHandler: function () {
		this._infoHandler = undefined;
		return this;
	},

	unRegisterErrorHandler: function () {
		this._errorHandler = undefined;
		return this;
	},

	unRegisterSuccessHandler: function () {
		this._successHandler = undefined;
		return this;
	},

	/**
	 * Updates notifications on the screen.
	 * @param ctx
	 * @private
	 */
	_behaviour: function (ctx) {
		if (self._active) {
			// Handle info notifications
			if (self._infoHandler !== undefined) {
				self._infoHandler(self._queuedInfos);
			}
			// Handle error notifications
			if (self._errorHandler !== undefined) {
				self._errorHandler(self._queuedErrors);
			}
			// Handle success notifications
			if (self._successHandler !== undefined) {
				self._successHandler(self._queuedSuccesses);
			}
		}
	},

	_onNotificationInfo: function (notification) {
		if (self._active && (self._infoHandler !== undefined)) {
			self._queuedInfos.push(notification);
		}
	},

	_onNotificationError: function (notification) {
		if (self._active && (self._errorHandler !== undefined)) {
			self._queuedErrors.push(notification);
		}
	},

	_onNotificationSuccess: function (notification) {
		if (self._active && (self._successHandler !== undefined)) {
			self._queuedSuccesses.push(notification);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NotificationComponent; }
