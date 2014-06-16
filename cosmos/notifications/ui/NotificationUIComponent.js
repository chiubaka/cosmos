var NotificationUIComponent = IgeEventingClass.extend({
	classId: 'NotificationUIComponent',
	componentId: 'notificationUI',

	init: function (entity, options) {

		if (ige.isClient) {

		}

		this.log('Notification UI component initiated!');
	},

	infoHandler: function (queue) {
		console.log(queue[0]);
	},

	errorHandler: function (queue) {
	
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NotificationUIComponent; }
