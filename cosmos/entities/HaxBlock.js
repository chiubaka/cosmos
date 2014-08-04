var HaxBlock = IgeEntity.extend({
	classId: 'HaxBlock',

	init: function() {
		IgeEntity.prototype.init.call(this);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = HaxBlock; }
