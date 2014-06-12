/**
 * A CargoTool represents a type of block that the player can select in order to
 * change the type of block that they are using to construct with.
 *
 * @class
 * @typedef {Object} CargoTool
 * @namespace 
 */
var CargoTool = Tool.extend({
	classId: 'CargoTool',

	/**
	 * The CargoTool's unselected icon image as an IGE texture.
	 * Since we are drawing a Block as an icon, we don't want to draw a picture.
	 * Therefore, blank out the stub and active icons so no picture is drawn.
	 * @memberof CargoTool
	 * @constant {string}
	 * @default
	 * @instance
	 */
	NORMAL_ICON: '',

	/**
	 * The CargoTool's selected icon image as an IGE texture.
	 * Since we are drawing a Block as an icon, we don't want to draw a picture.
	 * Therefore, blank out the stub and active icons so no picture is drawn.
	 * @memberof CargoTool
	 * @constant {string}
	 * @default
	 * @instance
	 */
	ACTIVE_ICON: '',

	/**
	 * The Tool's default stub RGB color value when the player hovers over 
	 * the Tool.
	 * @constant {string}
	 * @default
	 * @memberof CargoTool
	 * @instance
	 */
	HOVER_STUB_COLOR: 'rgb(255, 255, 255)',

	/**
	 * The Tool's default stub RGB color value when the player clicks on 
	 * the Tool.
	 * @constant {string}
	 * @default
	 * @memberof CargoTool
	 * @instance
	 */
	ACTIVE_STUB_COLOR: 'rgba(255, 255, 255, 0.5)',

	/**
	 * The Tool's default background RGB color value when the player hovers 
	 * over the Tool.
	 * @constant {string}
	 * @default
	 * @memberof CargoTool
	 * @instance
	 */
	HOVER_COLOR: 'rgb(0, 170, 255)',

	/**
	 * The Tool's default background RGB color value when the player clicks
	 * on the Tool.
	 * @constant {string}
	 * @default
	 * @memberof CargoTool
	 * @instance
	 */
	ACTIVE_COLOR: 'rgb(0, 136, 255)',

	/**
	 * The Tool's default background RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof CargoTool
	 * @instance
	 */
	BG_COLOR: 'rgb(2,108,210)',
	
	/**
	 * The Tool's default stub RGB color value.
	 * @constant {string}
	 * @default
	 * @memberof CargoTool
	 * @instance
	 */
	STUB_COLOR: 'rgba(0, 0, 0, 0.5)',
	
	/**
	 * Overrides the Tool mount method to include a call to mount the Block that visually represents this CargoTool.
	 * @param elem {Object} the entity to mount ourselves to
	 * @memberof CargoTool
	 * @instance
	 */
	mount: function(elem) {
		Tool.prototype.mount.call(this, elem);

		this._mountBlock();
	},

	/**
	 * Mounts a Block entity corresponding to this CargoTool's name (i.e. the block type in the cargo inventory)
	 * to the CargoTool as a visual diagram.
	 * @memberof CargoTool
	 * @instance
	 * @private
	 */
	_mountBlock: function() {
		// Get the appropriate block from the block type
		this._mountedBlock = Block.blockFromClassId(this.TOOL_NAME);
		this._mountedBlock.mount(this);

		if (this._quantity !== undefined) {
			this._mountedBlock.translateBy(0, -10, 0);
		}
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoTool;
}