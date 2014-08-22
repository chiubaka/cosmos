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
	genProceduralAsteroid: function(maxNumBlocks, blockDistribution, symmetric,
		translate) {
		// Whether or not to generate a symmetric asteroid
		symmetric = symmetric || false;

		// The block distribution to seed the procedural block type generator with
		blockDistribution = blockDistribution || this.elementDistributions.STANDARD;

		maxNumBlocks = maxNumBlocks || 100;

		var blockStructure = new GeneratedBlockStructure({
			maxNumBlocks: maxNumBlocks,
			blockDistribution: blockDistribution,
			symmetric: symmetric,
			translate: translate
		});

		// Number of blocks that can be contained in this asteroid.
		var blocksRemaining = Math.floor(this.weightedRandom(maxNumBlocks, maxNumBlocks * 0.75, 0.25));

		// Start the generation algorithm at a specific cell in the asteroid.
		var startingCell = {
			row: 0,
			col: 0
		};

		// Initialize the block bag.
		var nextLocationsToFill = [];
		var locationsToFill = [];
		locationsToFill.push(startingCell);

		var first = true;

		//var sizes = [12, 9, 8, 6, 4, 3, 2, 1];
		//var numBlocks = [0, 0, 0, 0, 1, 3, 100, 200];

		var sizes = 		[12, 9, 8, 6, 4, 3, 2, 1];
		var numLayers = [0, 0, 0, 0, 1, 1, 2, 2];
		console.log("Starting a new asteroid");

		for (var index = 0; index < 8; index++) {
			currentSize = sizes[index];

			for (var layer = 0; layer < numLayers[index]; layer++) {
				console.log("Starting a new layer!");

				while (nextLocationsToFill.length > 0) {
					locationsToFill.push(nextLocationsToFill.pop());
				}

				while (locationsToFill.length > 0) {
					// Randomly select a block to place.
					var blockIndex = Math.floor(Math.random() * locationsToFill.length);
					var block = locationsToFill[blockIndex];
					/*
					if (asteroidConstr[block.row] !== undefined && asteroidConstr[block.row][block.col] !== undefined) {
						locationsToFill.remove(blockIndex);
						continue;
					}
					*/
					if (blockStructure.get(new IgePoint2d(block.col, block.row)).length > 0) {
						locationsToFill.remove(blockIndex);
						continue;
					}

					if (first) {
						var newBlock = this._drawFromDistribution(blockDistribution, {gridWidth: currentSize, gridHeight: currentSize});
						first = false;
					} else {
						var newBlock = this._getBlockType(blockStructure, block.row, block.col, blockDistribution, {gridWidth: currentSize, gridHeight: currentSize});
					}

					actualLocation = JSON.parse(JSON.stringify(block));
					if (Math.random() < .5) {
						actualLocation.col -= currentSize - 1;
					}
					if (Math.random() < .5) {
						actualLocation.row -= currentSize - 1;
					}

					var result = blockStructure.put(newBlock, new IgePoint2d(actualLocation.col, actualLocation.row), false);

					if (result !== null)	{
						// Remove the location, because it is now filled
						locationsToFill.remove(blockIndex);
						blocksRemaining--;
						/*
						if (symmetric) {
							blockStructure.put(Block.fromType(newBlock.classId()),
								new IgePoint2d(-block.col, -block.row), false);
							blocksRemaining--;
						}
						*/
						// Push all cardinal neighbors into the locations that need to be filled
						for (var slideOverAmount = 0; slideOverAmount < currentSize; slideOverAmount++) {
							nextLocationsToFill.push({ row: actualLocation.row - 1,								col: actualLocation.col + slideOverAmount });
							nextLocationsToFill.push({ row: actualLocation.row + currentSize, 		col: actualLocation.col + slideOverAmount });
							nextLocationsToFill.push({ row: actualLocation.row + slideOverAmount, col: actualLocation.col - 1 });
							nextLocationsToFill.push({ row: actualLocation.row + slideOverAmount, col: actualLocation.col + currentSize });
						}
					} else {
						nextLocationsToFill.push(block);
						locationsToFill.remove(blockIndex);
					}
				}
			}
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
	_getBlockType: function(blockStructure, row, col, blockDistribution, dimensions) {
		// Count up the neighbors
		var valid = false;
		var neighborCounts = [];
		for (var curRow = row - 1; curRow <= row + 1; curRow++) {
			for (var curCol = col - 1; curCol <= col + 1; curCol++) {
				if (curRow == row && curCol == col) {
					continue;
				}

				if (blockStructure.get(new IgePoint2d(curCol, curRow)).length === 0) {
					continue;
				}
				var blockType = blockStructure.get(new IgePoint2d(curCol, curRow))[0].classId()

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
		var type = WeightedSelection.select(weights);

		//if (cosmos.blocks.instances[type] instanceof Element) {
			var purity = MathUtils.chooseRandomlyFromArray([Element.PURITIES.PURE, Element.PURITIES.IMPURE, Element.PURITIES.IMPURE, Element.PURITIES.VERY_IMPURE, Element.PURITIES.VERY_IMPURE]);
			return new Element({
				resource: type,
				purity: purity,
				gridWidth: dimensions.gridWidth,
				gridHeight: dimensions.gridHeight
			});
		//}
		/* else {
			return Block.fromType(type);
		}*/
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
	 * Selects a random {@link Block} from the given distribution.
	 * @param distribution {Object} A distribution object which defines relative weights of different {@link Block}
	 * types.
	 * @returns {Block} A {@link Block} randomly drawn from the provided distribution.
	 * @memberof BlockStructureGenerator
	 * @private
	 */
	_drawFromDistribution: function(distribution, dimensions) {
		var type = WeightedSelection.select(distribution);

		if (cosmos.blocks.instances[type] instanceof Element) {
			return new Element({
				resource: type,
				purity: Element.PURITIES.IMPURE,
				gridWidth: dimensions.gridWidth,
				gridHeight: dimensions.gridHeight
			});
		} else {
			return Block.fromType(type);
		}
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
			"IceBlock": 30,
			"IronBlock": 30,
			"CarbonBlock": 30,

			//here are some rare things. These guys should look really cool.
			"GoldBlock": 5,
			"DragonBlock": 2,
			"TitaniumBlock": 2,
			//"CloakBlock": 1,
			//"CloakVioletBlock": 1,
			"SteelBlock": 10
		},

		COLD_COLOR_THEMED: {
			"IceBlock": 30,
			"IronBlock": 30,
			"CarbonBlock": 30,

			"KryptoniteBlock": 2,
			"CobaltBlock": 2,
			"MythrilBlock": 2,
			"AdamantiumBlock": 2,
			"FluorineBlock": 2,
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

			if (rand < .4) {
				return BlockStructureGenerator.elementDistributions.STANDARD;
			} else if (rand < .8) {
				return BlockStructureGenerator.elementDistributions.COLD_COLOR_THEMED;
			} else if (rand < .9) {
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
			"IronEngineBlock": .1,
			"FuelBlock": .2,
			"PowerBlock": .1,
			"IronThrusterBlock": .1,
			"CargoBlock": .1,
			"IronPlatingBlock": .3,
			"MiningLaserBlock": .1,
			"TitaniumPlatingBlock": .1,
			"CloakBlock": .1
		},

		HIGH_CARGO: {
			"IronEngineBlock": .05,
			"FuelBlock": .05,
			"PowerBlock": .05,
			"IronThrusterBlock": .05,
			"CargoBlock": .5,
			"IronPlatingBlock": .3
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
