var MathUtils = {};

MathUtils.roundToDecimals = function(value, decimals) {
	return Number(Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals));
};

MathUtils.round = function(value) {
	return MathUtils.roundToDecimals(value, MathUtils.EPSILON);
};


MathUtils.worldVectorToLocalVector = function(vector, entity) {
	var translatedVector = vector.minusPoint(new IgePoint2d(entity.translate().x(), entity.translate().y()));
	return translatedVector.rotate(entity.rotate().z());
};

MathUtils.localVectorToWorldVector = function(vector, entity) {
	var rotatedVector = vector.rotate(-entity.rotate().z());
	return rotatedVector.addPoint(new IgePoint2d(entity.translate().x(), entity.translate().y()));
};

MathUtils.rotate = function(vector, theta) {
	return new IgePoint2d(
		vector.x * Math.cos(theta) - vector.y * Math.sin(theta),
		vector.x * Math.sin(theta) + vector.y * Math.cos(theta)
	);
};

// By default, round to 10 decimal places.
MathUtils.EPSILON = 10;

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = MathUtils;
}
