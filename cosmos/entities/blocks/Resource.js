var Resource = Block.extend({
	classId: "Resource",

	init: function(data) {
		data = this.dataFromConfig(data);
		Block.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Resource;
}