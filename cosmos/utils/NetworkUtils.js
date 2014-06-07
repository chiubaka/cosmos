var NetworkUtils = {

};

NetworkUtils.block = function(block) {
	if (block === undefined) {
		return undefined;
	}

	return {
		blockGridId: block.blockGrid().id(),
		row: block.row(),
		col: block.col()
	};
};

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