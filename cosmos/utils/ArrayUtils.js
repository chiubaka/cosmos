var ArrayUtils = {
	/**
	 * Referenced from http://ejohn.org/blog/javascript-array-remove/
	 */
	remove: function(array, from, to) {
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);
	},
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ArrayUtils;
}