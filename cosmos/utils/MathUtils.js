var MathUtils = {};

MathUtils.roundToDecimals = function(value, decimals) {
	return Number(Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals));
};

MathUtils.round = function(value) {
	return MathUtils.roundToDecimals(value, MathUtils.EPSILON);
};

// By default, round to 10 decimal places.
MathUtils.EPSILON = 10;

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = MathUtils;
}