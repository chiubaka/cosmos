/**
 * weighted.js
 * Weighted random selection.
 * A dead-simple module for picking a random item from a set, with weights.
 * Extremely useful for bot scripting.
 * From https://github.com/Schoonology/weighted
 */

function getTotal(weights) {
	var total = weights.__weighted_total

	if (total != null) {
		return total;
	}

	function wrap(arr, fn) {
		return function() {
			arr.__weighted_total = null;
			fn.apply(arr, arguments);
		}
	}

	if (total === undefined) {
		['pop', 'push', 'shift', 'unshift', 'splice'].forEach(function(key) {
			weights[key] = wrap(weights, weights[key]);
		});
	}

	total = weights.__weighted_total = weights.reduce(function(prev, curr) {
		return prev + curr;
	}, 0);

	return total;
}

function _selectArr(set, weights, options) {
	if (typeof options.rand !== 'function') {
		options.rand = Math.random;
	}

	if (set.length !== weights.length) {
		throw new Error('Different number of options & weights.');
	}

	var total = options.total || (options.normal ? 1 : getTotal(weights)),
		key = options.rand() * total,
		index = 0;

	for (; index < weights.length; index++) {
		key -= weights[index];

		if (key < 0) {
			return set[index];
		}
	}

	throw new Error('All weights do not add up to >= 1 as expected.')
}


function _selectObj(obj, options) {
	var keys = Object.keys(obj),
		values = keys.map(function(key) {
			return obj[key];
		});

	return _selectArr(keys, values, options);
}

/**
 * Given a weighted set, returns a selected item in the set.
 * @example #Array example
 *     var options = ['Wake Up', 'Snooze Alarm'],
 *                   weights = [0.25, 0.75]
 *     console.log('Decision:', weighted.select(options, weights)
 * @example #Object example
 *     var options = {
 *       'Wake Up': 0.25,
 *       'Snooze Alarm': 0.75
 *     }
 *     console.log('Decision:', weighted.select(options))
 * @param set {(Array | Object)} The set of items to select from
 * @param weights {Array=} The set of weights (if using array version)
 * @param options {function=} Optional user supplied random function
 * @returns {*} Selected item in the set
 */
function select(set, weights, options) {
	if (typeof options === 'function') {
		options = {
			rand: options
		};
	}

	if (options == null) {
		options = {};
	}

	if (Array.isArray(set)) {
		if (Array.isArray(weights)) {
			if (set.length === weights.length) {
				return _selectArr(set, weights, options);
			}

			throw new Error('Set and Weights are different sizes.');
		}

		throw new Error('Set is an Array, and Weights is not.');
	}

	if (typeof set === 'object') {
		return _selectObj(set, weights || options);
	}

	throw new Error('Set is not an Object, nor is it an Array.');
}

module.exports = select;
module.exports.select = select;
