var NotificationUIComponent = IgeEventingClass.extend({
	classId: 'NotificationUIComponent',
	componentId: 'notificationUI',
	notificationUIRoot: 'cosmos/notifications/ui/',

	init: function (entity, options) {
		var self = this;

		if (ige.isClient) {

			ige.requireScript(self.notificationUIRoot + 'vendor/jquery-2.1.1.min.js');

			ige.on('allRequireScriptsLoaded', function () {
				// Load notification html into the DOM
				self.loadHtml(self.notificationUIRoot + 'notification.html', function (html) {
					// Add the html
					$('body').append($(html));

					// Load the notification stylesheet
					ige.requireStylesheet(self.notificationUIRoot + 'notification.css');

					ige.notification.registerInfoHandler(ige.notification.notificationUI.infoHandler);
					ige.notification.registerErrorHandler(ige.notification.notificationUI.errorHandler);
				});
			}, null, true);

		}

		this.log('Notification UI component initiated!');
	},

	// TODO: Handle multiple messages in queue better, perhaps make a new div for
	// each message
	infoHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var infosIndex = queue.pop();
			$('#notificationInfo').html(NotificationDefinitions.infos[infosIndex]);
			$('#notificationInfo').fadeIn(150).delay(3000).fadeOut("slow")
		}

	},

	errorHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var errorsIndex = queue.pop();
			$('#notificationError').html(NotificationDefinitions.errors[errorsIndex]);
			$('#notificationError').fadeIn(150).delay(3000).fadeOut("slow")
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
