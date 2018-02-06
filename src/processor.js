/**
 * Copyright (c) 2018 Alakbar Ayyubov
 * 
 * @fileOverview Pug file processor that compiles into easy-to-use JavaScript templates
 * @name processor.js
 * @author Alakbar Ayyubov
 * @license MIT 
 *
 * Copyright 2018
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const pug  = require("pug");
const fs   = require("fs");
const path = require("path");
const uglify = require("uglify-js");

// Buffer to hold the compiled stuff in it
let outBuff = [];

/**
 * Iterate through the gievn array asynchronously and perform actions
 * 
 * @param  {Array[Object]} arr - An input array
 * @param  {Function} eachFn   - Callback that needs to be applied for each element
 * @param  {Function} endFn    - Callback that is invoked at the end of the iteration
 * @return void
 */
function asyncIterator(arr, eachFn, endFn) {
	let ind = 0;
	let len = arr.length;
	let item = arr[ind];

	let next = (err) => {
		if(err)
			return endFn(err);
		if(ind == len-1) {
			return endFn();
		} else {
			ind += 1;
			return eachFn(arr[ind], next);
		}
	}
	return eachFn(item, next);
}

/**
 * Compiles the Pug file and returns the output in the callback
 * 
 * @param  {String}   filePath - Pug file path
 * @param  {Function} callback - Callback function that has 2 arguments: (err, result) => {}
 * @return void
 */
function compileFile(filePath, callback) {
	if(filePath.match(/\.pug$/)) {
		fs.readFile(filePath, 'UTF-8', (err, fileContent) => {
			if(err)
				return callback(err);
			let fileName = path.parse(filePath).name;
			var compiledOutput = pug.compileClient(fileContent, {compileDebug: false, filename: filePath});
			compiledOutput = compiledOutput.replace("function template(", ` ;PUG_TEMPLATES[\"${fileName}\"] = function (`);
			return callback(null, compiledOutput);
		});
	} else {
		return callback();
	}
}

/**
 * Receives an array of file paths and performs compilation
 * 
 * @param  {Array[String]}  filesArr - List of file paths
 * @param  {Function}       callback - Callback function with 2 arguments: (err, result) => {}
 * @return void
 */
function processFiles(filesArr, callback) {
	asyncIterator(filesArr, 
		(filePath, next) => {
			compileFile(filePath, (err, output) => {
				if(err) return next(err);
				outBuff.push(output);
				next();
			})
		}
		, callback);
}

function main(files, callback) {
	var outTemplate = ";var PUG_TEMPLATES = {}; \n";

	if(files && files.length) {
		processFiles(files, (err) => {
			if(err) return callback(err);

			// outTemplate += fs.readFileSync(path.resolve(__dirname, "../node_modules/pug-runtime/index.js"), "UTF-8") + "\n\n";

			outTemplate += outBuff.join("\n\n");

			return callback(null, outTemplate);
		})
	} else {
		return callback(new Error("No files given"));
	}
}

module.exports = main;
