/**
 * A utility class that generates {@link BlockStructure}s of different types, sizes, shapes, and distributions. Used to
 * procedurally generate the asteroids in the world as well as the derelict ship parts.
 * @class
 * @typedef {Object} BlockStructureGenerator
 * @namespace
 */
var BlockStructureGenerator = {
	/**
	 * Procedurally generates an asteroid recursively
	 * @param maxNumBlocks {number} The maximum number of {@link Block}s to place in this procedurally generated
	 * asteroid. If no value is provided, the default is 100.
	 * @param blockDistribution {Object} The block distribution object to use when picking {@link Block}s to place in
	 * this asteroid. The default distribution is a standard element distribution.
	 * @param symmetric {boolean} Whether or not this asteroid should be symmetric. The default value is false.
	 * @return {BlockStructure} The procedurally generated asteroid.
	 * @memberof BlockStructureGenerator
	 */
	genProceduralAsteroid: function(maxNumBlocks, blockDistribution, symmetric) {
		var blockStructure = new BlockStructure();

		// Whether or not to generate a symmetric asteroid
		symmetric = symmetric || false;

		// The block distribution to seed the procedural block type generator with
		blockDistribution = blockDistribution || this.elementDistributions.STANDARD;

		maxNumBlocks = maxNumBlocks || 100;

		// Number of blocks that can be contained in this asteroid.
		var blocksRemaining = Math.floor(this.weightedRandom(maxNumBlocks, maxNumBlocks * 0.75, 0.25));

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
			if (blockStructure.get(block.row, block.col) !== undefined) {
				blocksToPlace.remove(blockIndex);
				continue;
			}

			if (first) {
				var newBlock = new IceBlock();
				first = false;
			} else {
				var newBlock = this._getBlockType(blockStructure, block.row, block.col, blockDistribution);
			}

			{
				blockStructure.add(block.row, block.col, newBlock, false);
				blocksRemaining--;

				if (symmetric) {
					blockStructure.add(block.row, -block.col, Block.blockFromClassId(newBlock.classId()), false);
					blocksRemaining--;
				}

				// Push cardinal neighbors into block bag.
				blocksToPlace.push({ row: block.row - 1, col: block.col });
				blocksToPlace.push({ row: block.row + 1, col: block.col });
				blocksToPlace.push({ row: block.row, col: block.col - 1 });
				blocksToPlace.push({ row: block.row, col: block.col + 1 });
			}

			// Remove the block
			blocksToPlace.remove(blockIndex);
		}

		return blockStructure;
	},

	/**
	 * Returns a block type computed from neighbors in the asteroid and the block rarities provided.
	 * Can be changed later to change the blocks that appear in asteroid generation.
	 * @param blockStructure {BlockStructure} The {@link BlockStructure} that we are constructing.
	 * @param row {number} The row number of the {@link Block} we are trying to figure out the type for in the
	 * generated {@link BlockStructure}.
	 * @param col {number} The col number of the {@link Block} we are trying to figure out the type for in the
	 * generated {@link BlockStructure}.
	 * @memberof BlockStructureGenerator
	 * @private
	 * @todo consider using a Perlin noise generator to generate a noise map as large as the block grid,
	 * and sampling at the x and y to get the block type?
	 */
	_getBlockType: function(blockStructure, row, col, blockDistribution) {
		// Count up the neighbors
		var valid = false;
		var neighborCounts = [];
		for (var curRow = row - 1; curRow <= row + 1; curRow++) {
			for (var curCol = col - 1; curCol <= col + 1; curCol++) {
				if (curRow == row && curCol == col) {
					continue;
				}

				if (blockStructure.get(curRow, curCol) == undefined) {
					continue;
				}
				var blockType = blockStructure.get(curRow, curCol).classId()

				if (neighborCounts[blockType] === undefined) {
					neighborCounts[blockType] = 0;
				}

				neighborCounts[blockType] += 1;
				valid = true;
			}
		}

		if (!valid) {
			return this._getDefaultBlock();
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
		return Block.blockFromClassId(selection);
	},

	/**
	 * Utility function that returns a random number within a certain range
	 * @param value
	 * @param upperBound
	 * @param weight
	 * @returns {number}
	 * @memberof BlockStructureGenerator
	 * @todo Derrick: document this function because it doesn't make any sense to me.
	 */
	weightedRandom: function(value, upperBound, weight) {
		return (Math.random() * (value)) * weight + (upperBound * (1 - weight));
	},

	/**
	 * Creates and returns a {@link BlockStructure} with a single {@link Block}.
	 * @param distribution {Object} The distribution object to draw the {@link Block} from. The default is a standard
	 * elemental distribution.
	 * @returns {BlockStructure} The newly created 1x1 {@link BlockStructure}.
	 * @memberof BlockStructureGenerator
	 */
	singleBlock: function(distribution) {
		distribution = distribution || this.elementDistributions.STANDARD;
		var blockStructure = new BlockStructure();
		blockStructure.add(0, 0, this._drawFromDistribution(distribution));

		return blockStructure;
	},

	/**
	 * Creates and returns a 2x2 asteroid as a {@link BlockStructure}.
	 * @param distribution {Object} The distribution object to draw the {@link Block}s from. The default is a standard
	 * elemental distribution.
	 * @returns {BlockStructure} The newly created 2x2 {@link BlockStructure}.
	 * @memberof BlockStructureGenerator
	 * @todo Edit this function so that it creates and returns an actual {@link BlockStructure} object.
	 * As it is written now, this won't work.
	 */
	littleAsteroid: function(distribution) {
		distribution = distribution || this.elementDistributions.STANDARD;
		return [
			[this._drawFromDistribution(distribution), this._drawFromDistribution(distribution)],
			[this._drawFromDistribution(distribution), this._drawFromDistribution(distribution)]
		];
	},

	/**
	 * Creates and returns a 3x3 asteroid with a missing center {@link Block} as a {@link BlockStructure.}
	 * @param distribution {Object} The distribution object to draw the {@link Block}s from. The default is a standard
	 * elemental distribution.
	 * @returns {BlockStructure} The newly created hollow, 3x3 asteroid with a missing center.
	 * @memberof BlockStructureGenerator
	 * @todo Edit this function so that it creates and returns an actual {@link BlockStructure} object. As it is written
	 * now, this won't work.
	 */
	hollowAsteroid: function(distribution) {
		distribution = distribution || this.elementDistributions.STANDARD;
		return [
			[this._drawFromDistribution(distribution), this._drawFromDistribution(distribution), this._drawFromDistribution(distribution)],
			[this._drawFromDistribution(distribution), undefined, this._drawFromDistribution(distribution)],
			[this._drawFromDistribution(distribution), this._drawFromDistribution(distribution), this._drawFromDistribution(distribution)],
		];
	},

	/**
	 * Selects a random {@link Block} from the given distribution.
	 * @param distribution {Object} A distribution object which defines relative weights of different {@link Block}
	 * types.
	 * @returns {Block} A {@link Block} randomly drawn from the provided distribution.
	 * @memberof BlockStructureGenerator
	 * @private
	 */
	_drawFromDistribution: function(distribution) {
		var selection = WeightedSelection.select(distribution);
		return Block.blockFromClassId(selection);
	},

	/**
	 * Returns a new {@link Block} of the default type.
	 * @returns {IceBlock} A new default block.
	 * @memberof BlockStructureGenerator
	 * @private
	 */
	_getDefaultBlock: function() {
		return new IceBlock();
	},

	/**
	 * {@link Element} {@link Block} distributions.
	 * @memberof BlockStructureGenerator
	 */
	elementDistributions: {
		STANDARD: {
			"IceBlock": 50,
			"IronBlock": 30,
			"CarbonBlock": 20,
			//here are some rare things. These guys should look really cool.
			"GoldBlock": 1,
			"CobaltBlock": 1,
			"FluorineBlock": 1,
			"DragonBlock": 1,
			"KryptoniteBlock": 1,
			"TitaniumBlock": 1,
			"CloakBlock": 1,
			"CloakVioletBlock": 1,
			"MithrilBlock": 1,
			"AdamantiumBlock": 1,
			"VioletBlock": 1,
			"OrangeBlock": 1,
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

		/**
		 * Randomly choose a distribution.
		 * @returns {*}
		 */
		randomDistribution: function() {
			var rand = Math.random();

			if (rand < .5) {
				return BlockStructureGenerator.elementDistributions.STANDARD;
			} else if (rand < .75) {
				return BlockStructureGenerator.elementDistributions.ICY;
			} else /*if (rand < 1)*/ {
				return BlockStructureGenerator.elementDistributions.ROCKY;
			}
		}
	},

	/**
	 * {@link Part} {@link Block} distributions.
	 * @memberof BlockStructureGenerator
	 */
	partDistributions: {
		STANDARD: {
			"EngineBlock": .1,
			"FuelBlock": .2,
			"PowerBlock": .1,
			"ThrusterBlock": .1,
			"CargoBlock": .1,
			"Block": .3,
			"MiningLaserBlock": .1,
			"TitaniumBlock": .1,
			"CloakBlock": .1
		},

		HIGH_CARGO: {
			"EngineBlock": .05,
			"FuelBlock": .05,
			"PowerBlock": .05,
			"ThrusterBlock": .05,
			"CargoBlock": .5,
			"Block": .3
		},

		/**
		 * Randomly choose a distribution.
		 * @returns {*}
		 */
		randomDistribution: function() {
			var rand = Math.random();

			if (rand < .75) {
				return BlockStructureGenerator.partDistributions.STANDARD;
			} else /*if (rand < 1)*/ {
				return BlockStructureGenerator.partDistributions.HIGH_CARGO;
			}
		}
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = BlockStructureGenerator;
}