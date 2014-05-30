var Element = Block.extend({
	classId: 'Element',

	init: function (data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Element; }
