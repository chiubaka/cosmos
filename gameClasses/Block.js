var Block = IgeEntity.extend({
	classId: 'Block',
	
	init: function () {
		IgeEntity.prototype.init.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }