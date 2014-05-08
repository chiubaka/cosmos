﻿var CargoTool = Tool.extend({
	classId: 'CargoTool',

	// Since we are drawing a Block as an icon, we don't want to draw a picture.
	// Therefore, blank out the stub and active icons so no picture is drawn.
	STUB_ICON: '',
	ACTIVE_ICON: '',

	BG_COLOR: 'rgb(3,131,255)',
	ACTIVE_COLOR: 'rgb(0, 136, 255)',
	HOVER_COLOR: 'rgb(0, 170, 255)',
	STUB_COLOR: 'rgba(0, 0, 0, 0.5)',
	HOVER_STUB_COLOR: 'rgb(255, 255, 255)',
	ACTIVE_STUB_COLOR: 'rgba(255, 255, 255, 0.5)',

	mount: function(elem) {
		Tool.prototype.mount.call(this, elem);

		this.mountBlock();
	},

	mountBlock: function() {
		// Get the appropriate block from the block type
		this._mountedBlock = Block.prototype.blockFromClassId(this.TOOL_NAME);
		this._mountedBlock.mount(this);

		if (this._quantity !== undefined) {
			this._mountedBlock.translateBy(0, -10, 0);
		}
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoTool;
}