var Element = Block.extend({
	classId: 'Element',

	init: function () {
		Block.prototype.init.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Element; }
