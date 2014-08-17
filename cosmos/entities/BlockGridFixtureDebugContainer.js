var BlockGridFixtureDebugContainer = IgeEntity.extend({
	classId: "BlockGridFixtureDebugContainer",

	init: function(data) {
		IgeEntity.prototype.init.call(this, data);

		this.addComponent(PixiRenderableComponent);
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = BlockGridFixtureDebugContainer;
}