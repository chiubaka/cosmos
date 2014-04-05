/*
Copyright (c) 2013 Lukas Olson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Source: (with modifications) https://github.com/lukasolson/simple-js-set
*/

var Set = function(hashFunction) {
		this._hashFunction = hashFunction || JSON.stringify;
		this._values = {};
		this._size = 0;
};


Set.prototype = {
	add: function add(value) {
		if (!this.contains(value)) {
			this._values[this._hashFunction(value)] = value;
			this._size++;
		}
	},
	
	remove: function remove(value) {
		if (this.contains(value)) {
			delete this._values[this._hashFunction(value)];
			this._size--;
		}
	},
	
	contains: function contains(value) {
		return typeof this._values[this._hashFunction(value)] !== "undefined";
	},
	
	size: function size() {
		return this._size;
	},
	
	each: function each(iteratorFunction, thisObj) {
		for (var value in this._values) {
			iteratorFunction.call(thisObj, this._values[value]);
		}
	}
};
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Set; }
