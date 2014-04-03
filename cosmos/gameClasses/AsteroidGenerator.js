var AsteroidGenerator = {
	/**
	 * A little tiny asteroid : )
	 */
	littleAsteroid: function() {
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
	randomAsteroid: function(maxSize, probabilityOfHole) {
		asteroid = []

		var maxSize = maxSize || 40;
		var probabilityOfHole = probabilityOfHole || .2;

		for(var x = 0; x < Math.random() * maxSize; x++) {
			rowList = [];
			for(var y = 0; y < Math.random() * maxSize; y++) {
				if(Math.random() < probabilityOfHole) {
					rowList.push(undefined);
				}
				else {
					if(Math.random() < .3) {
						rowList.push(new IronBlock());
					} else if(Math.random() < .3) {
						rowList.push(new CarbonBlock());
					} else {
						rowList.push(new IceBlock());
					}
				}
			}
			asteroid.push(rowList);

		}

		return asteroid;
	},

	/**
	 * Procedurally generates an asteroid recursively
	 */
	genProceduralAsteroid: function(maxSize, maxNumBlocks, blockDistribution) {
		var maxSize = (maxSize || 20);
		var blockDistribution = blockDistribution || this.blockDistributions.STANDARD;

		// Dimensions of this generated asteroid. Guaranteed to be at least 0.25 of the upper bound.
		// Weighted so that we don't get super small asteroids
		var asteroidDim = Math.floor(this.weightedRandom(maxSize, maxSize, 0.75));
		var maxNumBlocks = (maxNumBlocks || asteroidDim * asteroidDim);

		console.log("[DEBUG] Asteroid dimensions: " + asteroidDim);
		console.log("[DEBUG] Max number of blocks: " + maxNumBlocks);

		// Number of blocks that can be contained in this asteroid. Guaranteed to be at least 0.5 of the dimensions
		// so we have some bulk in the asteroid.
		var numBlocks = Math.floor(this.weightedRandom(maxNumBlocks, maxNumBlocks, 0.5));
		var blocksRemaining = numBlocks;

		console.log("[DEBUG] Number of blocks: " + numBlocks);

		// The asteroid itself: a 2D array of blocks.
		var asteroidConstr = [[]];

		// Start the generation algorithm at a specific cell in the asteroid.
		var startingCell = {
			x: Math.floor(asteroidDim / 2),
			y: Math.floor(asteroidDim / 2)
		};

		console.log("[DEBUG] Starting cell: " + startingCell.x + "," + startingCell.y);

		// Initialize the block bag.
		var blocksToPlace = [];
		blocksToPlace.push(startingCell);

		var first = true;
		while (blocksRemaining > 0 && blocksToPlace.length > 0) {
			// Randomly select a block to place.
			var blockIndex = Math.floor(Math.random() * blocksToPlace.length);
			var block = blocksToPlace[blockIndex];

			console.log("[DEBUG] Placing block at: " + block.x + "," + block.y);

			if (asteroidConstr[block.x] !== undefined && asteroidConstr[block.x][block.y] !== undefined) {
				blocksToPlace.remove(blockIndex);
				continue;
			}

			if (block.x > asteroidDim || block.x < 0 ||
				block.y > asteroidDim || block.y < 0) {
				blocksToPlace.remove(blockIndex);
				continue;
			}

			// Allocate a new column if it doesn't exist.
			if (asteroidConstr[block.x] === undefined) {
				asteroidConstr[block.x] = [];
			}

			if (first) {
				asteroidConstr[block.x][block.y] = new IceBlock();
				first = false;
			} else {
				asteroidConstr[block.x][block.y] = this.getBlockType(asteroidConstr, block.x, block.y, blockDistribution);
			}

			blocksRemaining--;

			// Push cardinal neighbors into block bag.
			blocksToPlace.push({ x: block.x - 1, y: block.y });
			blocksToPlace.push({ x: block.x + 1, y: block.y });
			blocksToPlace.push({ x: block.x, y: block.y - 1 });
			blocksToPlace.push({ x: block.x, y: block.y + 1 });

			// Remove the block
			blocksToPlace.remove(blockIndex);
		}

		// Now, prune all unused columns in the asteroid to result in the final asteroid
		var asteroid = [];
		for (var col in asteroidConstr) {
			if (asteroidConstr[col]) {
				asteroid.push(asteroidConstr[col]);
			}
		}

		return asteroid;
	},

	/**
	 * Returns a block type computed from neighbors in the asteroid and the block rarities provided.
	 * Can be changed later to change the blocks that appear in asteroid generation.
	 *
	 * TODO: consider using a Perlin noise generator to generate a noise map as large as the block grid,
	 * and sampling at the x and y to get the block type?
	 */
	getBlockType: function(blockArray, x, y, blockDistribution) {
		return new IronBlock();

		// Count up the neighbors
		var weights = [];
		for (var row = y - 1; row <= y + 1; row++) {
			for (var col = x - 1; col <= x + 1; col++) {
				if (row == y && col == x) {
					continue;
				}

				if (blockArray[col][row] === undefined) {
					continue;
				}

				var blockType = blockArray[col][row].classId;
				weights[blockType]++;
			}
		}

		// Weight the block rarities so clusters of similar blocks are more likely.

	},

	weightedRandom: function(value, upperBound, weight) {
		return (Math.random() * (value)) * weight + (upperBound * (1 - weight));
	},


	blockDistributions: {
		STANDARD: {
			"IceBlock": 0.5,
			"IronBlock": 0.3,
			"CarbonBlock": 0.2
		}
	}
};

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = AsteroidGenerator;
}
