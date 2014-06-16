var NotificationUI = IgeClass.extend({
	classId: 'NotificationUI',

	init: function () {
		console.log('init');
	},
	
	infoHandler: function (queue) {
		console.log(queue[0]);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = NotificationUI; }
