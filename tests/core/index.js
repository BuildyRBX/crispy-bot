const Jasmine = require('jasmine');
require('./mock.js');

module.exports = new Jasmine();

/**
 * Gets a floating-point number.
 * @param {?number} min The minimum number range.
 * @param {?number} max The maximum number range.
 * @returns {number}
 */
module.exports.getFloat = function(min = 0, max = 9) {
	return min + Math.random()*(max - min);
};

/**
 * Gets a whole number.
 * @param {?number} min The minimum number range.
 * @param {?number} max The maximum number range.
 * @returns {number}
 */
module.exports.getInt = function(min = 0, max = 9) {
	return Math.floor(this.getFloat(min, max));
};

/**
 * Creates a random string.
 * @param {?number} min The minimum string length.
 * @param {?number} max The maximum string length.
 * @param {?string} range The minimum and maximum character codepoints (e.g.
 * `az`).
 * @returns {string}
 */
module.exports.getString = function(min = 1, max = 1, range = ' ~') {
	let startPoint = range.codePointAt(0);
	let endPoint = range.codePointAt(1);
	let points = [];
	for (let i = 0; i < this.getInt(min, max); i++)
		points.push(this.getInt(startPoint, endPoint));
	return String.fromCodePoint(...points);
};

/**
 * Gets a value from an array.
 * @param {Array<any>} arr The array.
 * @returns {any}
 */
module.exports.getFrom = function(arr) {
	if (!(arr instanceof Array))
		throw new Error('Cannot get from a non-array value.');
	return arr[Math.floor(Math.random()*arr.length)];
};
