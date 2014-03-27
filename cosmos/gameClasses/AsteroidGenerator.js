var AsteroidGenerator = {
	/**
	* A little tiny asteroid : )
	*/
	littleAsteroid: function () {
		return [
			[new CarbonBlock(), new IronBlock()],
			[new IronBlock(),   new CarbonBlock()]
		]
	},

	/**
	 * A hollow asteroid
	 */
	hollowAsteroid: function() {
		return [
			[new CarbonBlock(), new CarbonBlock(), new IronBlock()],
			[new IronBlock(),   undefined,         new CarbonBlock()],
			[new IronBlock(),   new IronBlock(),   new IronBlock()]
		]
	},

	/**
	* A random asteroid which may have holes in it
	*/
	randomAsteroid: function () {
		asteroid = []

		var maxSize = 10;
		var probabilityOfHole = .2;

		for(var x = 0; x < Math.random() * maxSize; x++) {
			rowList = [];
			for(var y = 0; y < Math.random() * maxSize; y++) {
				if(Math.random() < probabilityOfHole) {
					rowList.push(undefined);
				}
				else {
					rowList.push(new IronBlock());
				}
			}
			asteroid.push(rowList);
		}
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AsteroidGenerator; }
