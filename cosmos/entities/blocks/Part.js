var Part = Block.extend({
	classId: 'Part',

	init: function () {
		Block.prototype.init.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Part; }
