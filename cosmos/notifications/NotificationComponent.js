/**
 * The NotificationComponent handles both server and client notifications.
 * The NotificationComponent has three queues: Info, Error, and Success. 
 * Each engineStep, the behavior for the notificationComponent is called.
 * The behavior calls the registered notification UI functions.
 * This way, the UI is decoupled from the backend.
 * @class
 * @namespace
 */
var NotificationComponent = IgeEventingClass.extend({
	classId: 'NotificationComponent',
	componentId: 'notification',
	/** 
	 * True if component's behavior is running every engineStep
	 * @type {Boolean}
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_active: undefined,
	/** 
	 * Displays queued info notifications
	 * @type {function}
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_infoHandler: undefined,

	/** 
	 * Displays queued error notifications
	 * @type {function}
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_errorHandler: undefined,

	/** 
	 * Displays queued success notifications
	 * @type {function}
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_successHandler: undefined,

	init: function (entity, options) {
		if (ige.isServer) {
			// Define network commands server side
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
		}

		this.log('Notification component initiated!');
	},

	/**
	 * Starts the NotificationComponent so that notifications are pushed onto
	 * the notification queue and notification handlers are called every
	 * engineStep.
	 * @memberof NotificationComponent
	 * @instance
	 */
	start: function () {
		if (!this._active) {
			this._active = true;
			ige.addBehaviour('notificationStep', this._behaviour);
		}
	},

	/**
	 * Stops pushing notifications onto the notification queue and stops
	 * notification handlers from being called.
	 * @memberof NotificationComponent
	 * @instance
	 */
	stop: function () {
		if (this._active) {
			this._active = false;
			ige.removeBehaviour('notificationStep');
		}
	},

	/**
	 * Register info notification handler with the NotificationComponent
	 * This handler takes an array of notifications and should display them.
	 * @param handler {infoNotificationCallback} UI callback
	 * @returns {NotificationComponent}
	 * @memberof NotificationComponent
	 * @instance
	 */
	registerInfoHandler: function (handler) {
		this._infoHandler = handler;
		return this;
	},

	/**
	 * Register error notification handler with the NotificationComponent
	 * This handler takes an array of notifications and should display them.
	 * @param handler {errorNotificationCallback} UI callback
	 * @returns {NotificationComponent}
	 * @memberof NotificationComponent
	 * @instance
	 */
	registerErrorHandler: function (handler) {
		this._errorHandler = handler;
		return this;
	},

	/**
	 * Register success notification handler with the NotificationComponent
	 * This handler takes an array of notifications and should display them.
	 * @param handler {successNotificationCallback} UI callback
	 * @returns {NotificationComponent}
	 * @memberof NotificationComponent
	 * @instance
	 */
	registerSuccessHandler: function (handler) {
		this._successHandler = handler;
		return this;
	},

	/**
	 * Unregister info notification handler with the NotificationComponent.
	 * This will stop info notifications from being added to the info queue.
	 * Additionally, the info handler will not be called every engineStep.
	 * @returns {NotificationComponent}
	 * @memberof NotificationComponent
	 * @instance
	 */
	unRegisterInfoHandler: function () {
		this._infoHandler = undefined;
		return this;
	},

	/**
	 * Unregister error notification handler with the NotificationComponent.
	 * This will stop error notifications from being added to the error queue.
	 * Additionally, the error handler will not be called every engineStep.
	 * @returns {NotificationComponent}
	 * @memberof NotificationComponent
	 * @instance
	 */
	unRegisterErrorHandler: function () {
		this._errorHandler = undefined;
		return this;
	},

	/**
	 * Unregister success notification handler with the NotificationComponent.
	 * This will stop success notifications from being added to the success queue.
	 * Additionally, the success handler will not be called every engineStep.
	 * @returns {NotificationComponent}
	 * @memberof NotificationComponent
	 * @instance
	 */
	unRegisterSuccessHandler: function () {
		this._successHandler = undefined;
		return this;
	},

	/**
	 * Call notification handlers, which will display notifications on the screen.
	 * @param ctx {CanvasContext} Canvas context
	 * @private
	 * @memberof NotificationComponent
	 * @instance
	 */
	_behaviour: function (ctx) {
		var self = ige.notification;
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

	/**
	 * Push an info notification onto queuedInfos
	 * @param notification {String} A NotificationDefinition index
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_onNotificationInfo: function (notification) {
		var self = ige.notification;
		if (self._active && (self._infoHandler !== undefined)) {
			self._queuedInfos.push(notification);
		}
	},

	/**
	 * Push an error notification onto queuedErrors
	 * @param notification {String} A NotificationDefinition index
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_onNotificationError: function (notification) {
		var self = ige.notification;
		if (self._active && (self._errorHandler !== undefined)) {
			self._queuedErrors.push(notification);
		}
	},

	/**
	 * Push a success notification onto queuedSuccesses
	 * @param notification {String} A NotificationDefinition index
	 * @memberof NotificationComponent
	 * @private
	 * @instance
	 */
	_onNotificationSuccess: function (notification) {
		var self = ige.notification;
		if (self._active && (self._successHandler !== undefined)) {
			self._queuedSuccesses.push(notification);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NotificationComponent; }
