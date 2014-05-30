var Part = Block.extend({
	classId: 'Part',

	init: function(data) {
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Part; }
