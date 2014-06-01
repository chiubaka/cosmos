var UuidGenerator = {
	/**
	 * Generates a UUID according to RFC4122, that is practically unique.
	 * The UUID has a negligible chance of collision.
	 * @returns {string}
	 */
	gen: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			// Convert the number into a base 16 string
			return v.toString(16);
		});
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = UuidGenerator;
}
