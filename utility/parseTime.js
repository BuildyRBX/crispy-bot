const ms = require('ms');
let reverseMs = null;

/**
 * @license MIT
 * Copyright (c) 2016 Zeit, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * @ignore
 */
const multiMsRegExp = /\+?\d+(\.\d*)?\s*(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)/gi;

/**
 * @typedef {object} ParseOptions
 * @property {boolean} long If the string is a number.
 */

/**
 * @summary Parses a time.
 * @description
 * Parses a human readable time to a number in milliseconds.
 *
 * Although parsing a number is supported, this should be avoided as it adds
 * unnecesary overhead. Parsing numbers requires `pretty-ms`.
 * @param {string|string} input The time to parse.
 * @param {?ParseOptions} options
 * @returns {number} The number of milliseconds.
 * @requires ms
 */
function parseTime(input, options = {}) {
	let result = NaN;
	let match = null;

	if (options.long || typeof input === 'number') {
		if (reverseMs === null)
			reverseMs = require('pretty-ms');
		result = reverseMs(input, { verbose: true });
	} else {
		match = input.match(multiMsRegExp);
	}

	if (match)
		result = match.length >= 2 ?
			match.reduce((a, b) => ms(a) + ms(b)) :
			ms(match[0]);

	return result;
}

module.exports = parseTime;
