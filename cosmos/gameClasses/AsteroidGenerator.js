var AsteroidGenerator = {
	/**
	* A little tiny asteroid : )
	*/
	littleAsteroid: function () {
		return [
			[new Carbon(), new Iron()],
			[new Iron(),   new Carbon()]
		]
	},

	/**
	 * A hollow asteroid
	 */
	hollowAsteroid: function() {
		return [
			[new Carbon(), new Carbon(), new Iron()],
			[new Iron(),   undefined,    new Carbon()],
			[new Iron(),   new Iron(),   new Iron()]
		]
	}

	/**
	* A random asteroid which may have holes in it
	*/
	randomAsteroid: function () {
		asteroid = []

		var maxSize = 10;
		var probabilityOfHole = .2;

		for(var x = 0; x < Math.random() * maxSize) {
			rowList = [];
			for(var y = 0; y < Math.random() * maxSize) {
				if(Math.random() < probabilityOfHole) {
					rowList.push(undefined);
				}
				else {
					rowList.push(new Iron());
				}
			}
			asteroid.push(rowList);
		}
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AsteroidGenerator; }
