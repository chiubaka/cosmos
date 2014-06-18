var NotificationUIComponent = IgeEventingClass.extend({
	classId: 'NotificationUIComponent',
	componentId: 'notificationUI',
	notificationUIRoot: 'cosmos/notifications/ui/',

	init: function (entity, options) {
		var self = this;

		if (ige.isClient) {

			// Load Alertify, a notification library
			ige.requireScript(self.notificationUIRoot + 'vendor/alertify.js');

			ige.on('allRequireScriptsLoaded', function () {
				// Load Alertify stylesheets
				ige.requireStylesheet(self.notificationUIRoot +
					'vendor/alertify_themes/alertify.core.css');
				ige.requireStylesheet(self.notificationUIRoot +
					'vendor/alertify_themes/alertify.default.css');

				ige.notification.registerInfoHandler(ige.notification.notificationUI.infoHandler);
				ige.notification.registerErrorHandler(ige.notification.notificationUI.errorHandler);
				ige.notification.registerSuccessHandler(ige.notification.notificationUI.successHandler);
				}, null, true);

		}

		this.log('Notification UI component initiated!');
	},

	infoHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var infosIndex = queue.pop();
			var notification = NotificationDefinitions.infos[infosIndex];
			alertify.log(notification);
		}
	},

	errorHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var errorsIndex = queue.pop();
			var notification = NotificationDefinitions.errors[errorsIndex];
			alertify.log(notification, "error");
		}
	},

	successHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var successesIndex = queue.pop();
			var notification = NotificationDefinitions.successes[successesIndex];
			alertify.log(notification, "success");
		}
	},


	loadHtml: function (url, callback) {
		$.ajax({
			url: url,
			success: callback,
			dataType: 'html'
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NotificationUIComponent; }
