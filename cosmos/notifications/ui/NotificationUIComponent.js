/**
 * The NotificationUIComponent displays info, error, and success notifications.
 * It registers notification handlers in the NotificationComponent
 * backend.
 * @class
 * @namespace
 */
var NotificationUIComponent = IgeEventingClass.extend({
	classId: 'NotificationUIComponent',
	componentId: 'notificationUI',
	notificationUIRoot: '/vendor/alertify/',

	init: function (entity, options) {
		var self = this;

		if (ige.isClient) {
			// Load Alertify, a notification library
			ige.requireScript(self.notificationUIRoot + 'alertify.js');

			ige.on('allRequireScriptsLoaded', function () {
				// Load Alertify stylesheets
				ige.requireStylesheet(self.notificationUIRoot + 'alertify_themes/alertify.core.css');
				ige.requireStylesheet(self.notificationUIRoot +
					'alertify_themes/alertify.default.css');

				ige.notification.registerInfoHandler(ige.hud.notificationUI.infoHandler);
				ige.notification.registerErrorHandler(ige.hud.notificationUI.errorHandler);
				ige.notification.registerSuccessHandler(ige.hud.notificationUI.successHandler);
				ige.emit('cosmos:hud.subcomponent.loaded');
				}, null, true);

		}

		this.log('Notification UI component initiated!');
	},

	/**
	 * Displays queued info notifications using alertify.js
	 * @callback infoNotificationCallback
	 * @param queue {Array} Queued notifications
	 * @memberof NotificationUIComponent
	 * @instance
	 */
	infoHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var infosIndex = queue.pop();
			var notification = NotificationDefinitions.infos[infosIndex];
			alertify.log(notification);
		}
	},

	/**
	 * Displays queued error notifications using alertify.js
	 * @callback errorNotificationCallback
	 * @param queue {Array} Queued notifications
	 * @memberof NotificationUIComponent
	 * @instance
	 */
	errorHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var errorsIndex = queue.pop();
			var notification = NotificationDefinitions.errors[errorsIndex];
			alertify.log(notification, "error");
		}
	},

	/**
	 * Displays queued success notifications using alertify.js
	 * @callback successNotificationCallback
	 * @param queue {Array} Queued notifications
	 * @memberof NotificationUIComponent
	 * @instance
	 */
	successHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var successesIndex = queue.pop();
			var notification = NotificationDefinitions.successes[successesIndex];
			alertify.log(notification, "success");
		}
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NotificationUIComponent; }
