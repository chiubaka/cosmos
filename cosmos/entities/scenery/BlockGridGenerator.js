var BlockGridGenerator = {
	/**
	 * Asteroid constants
	 */
	DEFAULT_MAX_SIZE: 40,

	/**
	 * Procedurally generates an asteroid recursively
	 */
	genProceduralAsteroid: function(maxNumBlocks, blockDistribution, symmetric) {
		var blockGrid = new BlockGrid();

		// Whether or not to generate a symmetric asteroid
		symmetric = symmetric || false;

		// The block distribution to seed the procedural block type generator with
		blockDistribution = blockDistribution || this.blockDistributions.STANDARD;

		maxNumBlocks = maxNumBlocks || 100;

		// Number of blocks that can be contained in this asteroid.
		var numBlocks = Math.floor(this.weightedRandom(maxNumBlocks, maxNumBlocks * 0.75, 0.25));
		var blocksRemaining = numBlocks;

		// Start the generation algorithm at a specific cell in the asteroid.
		var startingCell = {
			row: 0,
			col: 0
		};

		// Initialize the block bag.
		var blocksToPlace = [];
		blocksToPlace.push(startingCell);

		var first = true;
		while (blocksRemaining > 0 && blocksToPlace.length > 0) {
			// Randomly select a block to place.
			var blockIndex = Math.floor(Math.random() * blocksToPlace.length);
			var block = blocksToPlace[blockIndex];
			/*
			if (asteroidConstr[block.row] !== undefined && asteroidConstr[block.row][block.col] !== undefined) {
				blocksToPlace.remove(blockIndex);
				continue;
			}
			*/
			if (blockGrid.get(block.row, block.col) !== undefined) {
				blocksToPlace.remove(blockIndex);
				continue;
			}

			//if (first) {
				var newBlock = new IceBlock();/*
				first = false;
			} else {
				var newBlock = this.getBlockType(blockGrid, block.row, block.col, blockDistribution);
			}*/

			// If the block can be added, add it!
			//if (blockGrid.add(block.row, block.col, newBlock)) {
			{
				blockGrid.add(block.row, block.col, newBlock, false);
				blocksRemaining--;

				/*if (symmetric) {
					blockGrid.add(block.row, -block.col, Block.prototype.blockFromClassId(newBlock.classId()), false);
					blocksRemaining--;
				}*/

				// Push cardinal neighbors into block bag.
				blocksToPlace.push({ row: block.row - 1, col: block.col });
				blocksToPlace.push({ row: block.row + 1, col: block.col });
				blocksToPlace.push({ row: block.row, col: block.col - 1 });
				blocksToPlace.push({ row: block.row, col: block.col + 1 });
			}

			// Remove the block
			blocksToPlace.remove(blockIndex);
		}

		return blockGrid;
	},

	/**
	 * Returns a block type computed from neighbors in the asteroid and the block rarities provided.
	 * Can be changed later to change the blocks that appear in asteroid generation.
	 *
	 * TODO: consider using a Perlin noise generator to generate a noise map as large as the block grid,
	 * and sampling at the x and y to get the block type?
	 */
	getBlockType: function(blockGrid, x, y, blockDistribution) {
		// Count up the neighbors
		var valid = false;
		var neighborCounts = [];
		for (var row = y - 1; row <= y + 1; row++) {
			for (var col = x - 1; col <= x + 1; col++) {
				if (row == y && col == x) {
					continue;
				}

				if (blockGrid.get(row, col) == undefined) {
					continue;
				}
				var blockType = blockGrid.get(row, col).classId()

				if (neighborCounts[blockType] === undefined) {
					neighborCounts[blockType] = 0;
				}

				neighborCounts[blockType] += 1;
				valid = true;
			}
		}

		if (!valid) {
			return this.getDefaultBlock();
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
		var blockGrid = new BlockGrid();
		blockGrid.add(0, 0, this.drawFromDistribution(distribution));

		return blockGrid;
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

	getDefaultBlock: function() {
		return new IceBlock();
	},

	blockDistributions: {
		STANDARD: {
			"IceBlock": 0.47,
			"IronBlock": 0.3,
			"CarbonBlock": 0.2,
			//here are some rare things. These guys should look really cool.
			"GoldBlock": 0.01,
			"CobaltBlock": 0.01,
			"FluorineBlock": 0.01
			//here are some easter-egg type things, which will add up to 0.002
			/* //I've commented this out per LEO-522
			// The idea is to make mining more exciting by having really unusual things buried inside of asteroids.
			"EngineBlock": 0.002 * .25,
			"FuelBlock": 0.002 * .25,
			"PowerBlock": 0.002 * .25,
			"ThrusterBlock": 0.002 * .25
			*/
		},

		ICY: {
			"IceBlock": 0.9,
			"IronBlock": 0.05,
			"CarbonBlock": 0.05
		},

		ROCKY: {
			"IceBlock": 0.0,
			"IronBlock": 0.5,
			"CarbonBlock": 0.5
		},

		SHIP_PARTS: {
			"EngineBlock": .1,
			"FuelBlock": .2,
			"PowerBlock": .2,
			"ThrusterBlock": .1,
			"Block": .4
		},

		randomDistribution: function() {
			var rand = Math.random();

			if (rand < .5) {
				return BlockGridGenerator.blockDistributions.STANDARD;
			} else if (rand < .75) {
				return BlockGridGenerator.blockDistributions.ICY;
			} else /*if (rand < 1)*/ {
				return BlockGridGenerator.blockDistributions.ROCKY;
			}
		}
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = BlockGridGenerator;
}
