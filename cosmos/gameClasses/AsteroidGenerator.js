var AsteroidGenerator = {
	/**
	 * Asteroid constants
	 */
	DEFAULT_MAX_SIZE: 40,

	/**
	 * A random asteroid which may have holes in it
	 */
	genRandomAsteroid: function(maxSize, probabilityOfHole) {
		asteroid = []

		var maxSize = maxSize || DEFAULT_MAX_SIZE;
		var probabilityOfHole = probabilityOfHole || .2;

		for (var x = 0; x < Math.random() * maxSize; x++) {
			rowList = [];
			for (var y = 0; y < Math.random() * maxSize; y++) {
				if (Math.random() < probabilityOfHole) {
					rowList.push(undefined);
				} else {
					if (Math.random() < .3) {
						rowList.push(new IronBlock());
					} else if (Math.random() < .3) {
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
		var maxSize = maxSize || this.DEFAULT_MAX_SIZE;
		var blockDistribution = blockDistribution || this.blockDistributions.STANDARD;

		// Dimensions of this generated asteroid. Guaranteed to be at least 0.25 of the upper bound.
		// Weighted so that we don't get super small asteroids
		var asteroidDim = Math.floor(this.weightedRandom(maxSize, maxSize, 0.75));
		var maxNumBlocks = (maxNumBlocks || asteroidDim * asteroidDim);

		// Number of blocks that can be contained in this asteroid.
		var numBlocks = Math.floor(this.weightedRandom(maxNumBlocks, maxNumBlocks * 0.75, 0.25));
		var blocksRemaining = numBlocks;

		// The asteroid itself: a 2D array of blocks.
		var asteroidConstr = [[]];

		// Start the generation algorithm at a specific cell in the asteroid.
		var startingCell = {
			x: Math.floor(asteroidDim / 2),
			y: Math.floor(asteroidDim / 2)
		};

		// Initialize the block bag.
		var blocksToPlace = [];
		blocksToPlace.push(startingCell);

		var first = true;
		while (blocksRemaining > 0 && blocksToPlace.length > 0) {
			// Randomly select a block to place.
			var blockIndex = Math.floor(Math.random() * blocksToPlace.length);
			var block = blocksToPlace[blockIndex];

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
		// Count up the neighbors
		var neighborCounts = [];
		for (var row = y - 1; row <= y + 1; row++) {
			for (var col = x - 1; col <= x + 1; col++) {
				if (row == y && col == x) {
					continue;
				}

				if (blockArray[col] === undefined || blockArray[col][row] === undefined) {
					continue;
				}

				var blockType = blockArray[col][row].classId();

				if (neighborCounts[blockType] === undefined) {
					neighborCounts[blockType] = 0;
				}

				neighborCounts[blockType] += 1;
			}
		}

		// Weight the block rarities so clusters of similar blocks are more likely.
		var weights = JSON.parse(JSON.stringify(blockDistribution));

		for (var neighbor in neighborCounts) {
			if (neighborCounts.hasOwnProperty(neighbor) && weights.hasOwnProperty(neighbor)) {
				weights[neighbor] += 1 - Math.exp(0.1 * (neighborCounts[neighbor] - 1));
			}
		}

		// Normalize the weights array
		var weightSum = 0;
		for (var neighbor in weights) {
			if (weights.hasOwnProperty(neighbor)) {
				weightSum += weights[neighbor];
			}
		}
		for (var neighbor in weights) {
			if (weights.hasOwnProperty(neighbor)) {
				weights[neighbor] /= weightSum;
			}
		}

		// Now, with a weighted probability, randomly select an element from the weights to be the type.
		var selection = WeightedSelection.select(weights);
		return Block.prototype.blockFromClassId(selection);
	},

	weightedRandom: function(value, upperBound, weight) {
		return (Math.random() * (value)) * weight + (upperBound * (1 - weight));
	},

	singleBlock: function(distribution) {
		distribution = distribution || this.blockDistributions.STANDARD;
		return [
			[this.drawFromDistribution(distribution)]
		];
	},

	littleAsteroid: function(distribution) {
		distribution = distribution || this.blockDistributions.STANDARD;
		return [
			[this.drawFromDistribution(distribution), this.drawFromDistribution(distribution)],
			[this.drawFromDistribution(distribution), this.drawFromDistribution(distribution)]
		];
	},

	hollowAsteroid: function(distribution) {
		distribution = distribution || this.blockDistributions.STANDARD;
		return [
			[this.drawFromDistribution(distribution), this.drawFromDistribution(distribution), this.drawFromDistribution(distribution)],
			[this.drawFromDistribution(distribution), undefined, this.drawFromDistribution(distribution)],
			[this.drawFromDistribution(distribution), this.drawFromDistribution(distribution), this.drawFromDistribution(distribution)],
		];
	},

	drawFromDistribution: function(distribution) {
		var selection = WeightedSelection.select(distribution);
		return Block.prototype.blockFromClassId(selection);
	},

	blockDistributions: {
		STANDARD: {
			"IceBlock": 0.5,
			"IronBlock": 0.3,
			"CarbonBlock": 0.2
		},

		ICY: {
			"IceBlock": 0.8,
			"IronBlock": 0.1,
			"CarbonBlock": 0.1
		},

		ROCKY: {
			"IceBlock": 0.0,
			"IronBlock": 0.5,
			"CarbonBlock": 0.5
		}
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = AsteroidGenerator;
}
