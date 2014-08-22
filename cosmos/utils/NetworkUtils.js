/**
 * The NetworkUtils class provides static utility functions for creating the kinds of objects that will be packaged
 * to send across the network from server to client or client to server.
 * @class
 * @namespace
 */
var NetworkUtils = {

};

/**
 * Converts a {@link Block} into a reference to a {@link BlockGrid}, a row, and a column. For use in specifying an
 * effected block when sending messages across the network.
 * @param block {Block} The {@link Block} to turn into a network object.
 * @returns {*} undefined if the provided {@link Block} is undefined, an object of the structure
 * {blockGridId: {number}, row: {number}, col: {number}} otherwise.
 * @memberof NetworkUtils
 * @static
 */
NetworkUtils.block = function(block) {
	if (block === undefined || block.gridData === undefined || block.gridData.loc === undefined) {
		return undefined;
	}

	return {
		blockGridId: block.blockGrid() !== undefined ? block.blockGrid().id() : undefined,
		row: block.gridData.loc.y,
		col: block.gridData.loc.x
	};
};

/**
 * Creates an effect object, which maintains information about what type of effect this is, what the source
 * {@link Block} of the effect is, and, optionally, the target of the effect. Target is only used for certain effects
 * like the mining laser effect which need to latch onto a second {@link Block}.
 * @param effectType {string} The type of this effect.
 * @param block {Block} The {@link Block} that is generating or associated with this effect.
 * @param targetBlock {Block} Optional argument. Specifies the target {@link Block} for effects like the mining laser
 * effect, which needs a second {@link Block} to latch onto.
 * @returns {{type: *, sourceBlock: *, targetBlock: *}} An effect object, which stores the effect type and two
 * network-converted {@link Block} objects as returned from {@link NetworkUtils#block}. The source block is the block
 * that the effect is being added to. The target block is a secondary block that is required for certain effects like
 * the mining laser effect.
 */
NetworkUtils.effect = function(effectType, block, targetBlock) {
	return {
		type: effectType,
		sourceBlock: NetworkUtils.block(block),
		targetBlock: NetworkUtils.block(targetBlock)
	};
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = NetworkUtils;
}