var UserBlockStructure = BlockStructure.extend({
	classId: 'UserBlockStructure',


	init: function(data) {
		BlockStructure.prototype.init.call(this, data);

		if (ige.isServer) {
			this.physicsBody.fixtureFilter['categoryBits'] =
				UserBlockStructure.BOX2D_CATEGORY_BITS;
			// Collide with everything, except for drops
			this.physicsBody.fixtureFilter['maskBits'] =
				0xffff & ~(1 << Drop.BOX2D_CATEGORY_BITS);
		}
	}
});

UserBlockStructure.BOX2D_CATEGORY_BITS = GeneratedBlockStructure.BOX2D_CATEGORY_BITS;


if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = UserBlockStructure; }
