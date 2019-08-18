/**
 * @module utils
 * @description Provides a set of basic functions.
 */

/**
 * @summary Copies default values.
 * @description
 * Sets default properties from `objDef` if they are missing from `obj`. The
 * resulting object is returned.
 * @param {object} obj The destination object.
 * @param {object} objDef Default values.
 * @returns {object}
 * @license CC BY-NC 4.0
 */
function defaults(obj, objDef) {
	for (let [name, prop] of Object.entries(objDef))
		if (!(name in obj))
			obj[name] = prop;

	return obj;
}

/**
 * @summary Gets a random floating-point number.
 * @description
 * Returns a random floating-point number that is inclusively in the `min` and
 * `max` range.
 * @param {?number} min The minimum number range.
 * @param {?number} max The maximum number range.
 * @returns {number}
 * @example
 * getRandFloat() => 3.73
 * getRandFloat() => 7.0
 * getRandFloat() => 1.252
 * getRandFloat() => 0
 * getRandFloat() => 9.0
 */
function getRandFloat(min = 0, max = 9) {
	return min + Math.random()*(max - min);
}

/**
 * @summary Gets a random whole number.
 * @description
 * Returns a random whole number that is inclusively in the `min` and `max`
 * range.
 * @param {?number} min The minimum number range.
 * @param {?number} max The maximum number range.
 * @returns {number}
 * @example
 * getRandFloat() => 3
 * getRandFloat() => 7
 * getRandFloat() => 1
 * getRandFloat() => 0
 * getRandFloat() => 9
 */
function getRandInt(min = 0, max = 9) {
	return Math.floor(getRandFloat(min, max));
}

/**
 * @summary Creates a random string.
 * @description
 * Returns a random string of characters with a length that is inclusively
 * between `min` and `max`.
 * @param {?number} min The minimum string length.
 * @param {?number} max The maximum string length.
 * @param {?string} range The minimum and maximum character codepoints (e.g.
 * `az`).
 * @returns {string}
 * @example
 * getRandString() => `a`
 * getRandString() => `%`
 * getRandString() => `J`
 * getRandString() => `~`
 * getRandString() => `{`
 * @tutorial StringRange
 */
function getRandString(min = 1, max = 1, range = ' ~') {
	let startPoint = range.codePointAt(0);
	let endPoint = range.codePointAt(1);
	let points = [];
	for (let i = 0; i < getRandInt(min, max); i++)
		points.push(getRandInt(startPoint, endPoint));
	return String.fromCodePoint(...points);
}

/**
 * Returns a random element from the array.
 * @param {Array<any>} arr The array.
 * @returns {any}
 * @example
 * let arr = ['apple', 'banana', 'pear', 'grapefruit', 'mango', 'orange'];
 * getRandFrom(arr) => 'pear'
 * getRandFrom(arr) => 'apple'
 * getRandFrom(arr) => 'apple'
 * getRandFrom(arr) => 'mango'
 * getRandFrom(arr) => 'grapefruit'
 */
function getRandFrom(arr) {
	if (!(arr instanceof Array))
		throw new Error('Cannot get from a non-array value.');
	return arr[Math.floor(Math.random()*arr.length)];
}

module.exports.defaults = defaults;
module.exports.getRandFloat = getRandFloat;
module.exports.getRandInt = getRandInt;
module.exports.getRandString = getRandString;
module.exports.getRandFrom = getRandFrom;
