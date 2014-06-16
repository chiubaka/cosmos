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

					// Load the editor stylesheet
					ige.requireStylesheet(self.notificationUIRoot + 'notification.css');

					ige.notification.registerInfoHandler(ige.notification.notificationUI.infoHandler)
				});
			}, null, true);

		}

		this.log('Notification UI component initiated!');
	},

	// TODO: Handle multiple messages in queue better
	infoHandler: function (queue) {
		for (var i = 0; i < queue.length; i++) {
			var notification = queue.pop();
			$('#notification').html(notification);
			$('#notification').fadeIn(150).delay(3000).fadeOut("slow")
		}

	},

	errorHandler: function (queue) {
	
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
