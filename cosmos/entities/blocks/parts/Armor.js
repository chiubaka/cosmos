var Armor = Part.extend({
	classId: 'Armor',

	init: function(data) {
		if (ige.isClient) {
			this.iconFrame = 'plating';
			this.textureSvg = ige.client.textures.plating;
		}

		Part.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Armor; }
