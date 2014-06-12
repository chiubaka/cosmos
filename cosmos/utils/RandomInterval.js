/**
 * Get a random number from an interval
 * @namespace
 */
var RandomInterval = {
	/**
	 * Get a random number from the interval [min, max]
	 * @param min {Integer}
	 * @param max {Integer}
	 * @returns {Integer}
	 * http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
	 */
	randomIntFromInterval: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1 ) + min);
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = RandomInterval;
}
