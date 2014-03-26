var AsteroidGenerator = {
	/**
	* A little tiny asteroid : )
	*/
	littleAsteroid: function () {
		return [
			[new Carbon(), new Iron()],
			[new Iron(), new Carbon()]
		]
	},

	/**
	* A random asteroid
	*/
	randomAsteroid: function () {
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AsteroidGenerator; }
