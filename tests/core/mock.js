const Module = require('module');
const fs = require('fs');
const path = require('path');

const defaultResolve = Module._resolveFilename;
const mocks = path.normalize(`${__dirname}/../mocks/`);
const defaultEnding = '.js';

Module._resolveFilename = function(filename, ...args) {
	let abs = path.normalize(mocks + filename);
	let exists = false;

	if (abs !== mocks && fs.existsSync(abs)) {
		exists = true;
	} else if (fs.existsSync(abs + defaultEnding)) {
		abs += defaultEnding;
		exists = true;
	}

	return defaultResolve(exists ? abs : filename, ...args);
};
