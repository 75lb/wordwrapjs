(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wordwrapjs = factory());
}(this, (function () { 'use strict';

  /**
   * Isomorphic, functional type-checking for Javascript.
   * @module typical
   * @typicalname t
   * @example
   * const t = require('typical')
   * const allDefined = array.every(t.isDefined)
   */

  /**
   * Returns true if input is a number. It is a more reasonable alternative to `typeof n` which returns `number` for `NaN` and `Infinity`.
   *
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   * @example
   * > t.isNumber(0)
   * true
   * > t.isNumber(1)
   * true
   * > t.isNumber(1.1)
   * true
   * > t.isNumber(0xff)
   * true
   * > t.isNumber(0644)
   * true
   * > t.isNumber(6.2e5)
   * true
   * > t.isNumber(NaN)
   * false
   * > t.isNumber(Infinity)
   * false
   */
  function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  /**
   * A plain object is a simple object literal, it is not an instance of a class. Returns true if the input `typeof` is `object` and directly decends from `Object`.
   *
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   * @example
   * > t.isPlainObject({ something: 'one' })
   * true
   * > t.isPlainObject(new Date())
   * false
   * > t.isPlainObject([ 0, 1 ])
   * false
   * > t.isPlainObject(/test/)
   * false
   * > t.isPlainObject(1)
   * false
   * > t.isPlainObject('one')
   * false
   * > t.isPlainObject(null)
   * false
   * > t.isPlainObject((function * () {})())
   * false
   * > t.isPlainObject(function * () {})
   * false
   */
  function isPlainObject (input) {
    return input !== null && typeof input === 'object' && input.constructor === Object
  }

  /**
   * An array-like value has all the properties of an array yet is not an array instance. An example is the `arguments` object. Returns `true`` if the input value is an object, not `null`` and has a `length` property set with a numeric value.
   *
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   * @example
   * function sum(x, y){
   *   console.log(t.isArrayLike(arguments))
   *   // prints `true`
   * }
   */
  function isArrayLike (input) {
    return isObject(input) && typeof input.length === 'number'
  }

  /**
   * Returns true if the typeof input is `'object'` but not null.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isObject (input) {
    return typeof input === 'object' && input !== null
  }

  /**
   * Returns true if the input value is defined.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isDefined (input) {
    return typeof input !== 'undefined'
  }

  /**
   * Returns true if the input value is undefined.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isUndefined (input) {
    return !isDefined(input)
  }

  /**
   * Returns true if the input value is null.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isNull (input) {
   return input === null
  }

  /**
   * Returns true if the input value is not one of `undefined`, `null`, or `NaN`.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isDefinedValue (input) {
   return isDefined(input) && !isNull(input) && !Number.isNaN(input)
  }

  /**
   * Returns true if the input value is an ES2015 `class`.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isClass (input) {
    if (typeof input === 'function') {
      return /^class /.test(Function.prototype.toString.call(input))
    } else {
      return false
    }
  }

  /**
   * Returns true if the input is a string, number, symbol, boolean, null or undefined value.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isPrimitive (input) {
    if (input === null) return true
    switch (typeof input) {
      case 'string':
      case 'number':
      case 'symbol':
      case 'undefined':
      case 'boolean':
        return true
      default:
        return false
    }
  }

  /**
   * Returns true if the input is a Promise.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isPromise (input) {
    if (input) {
      const isPromise = isDefined(Promise) && input instanceof Promise;
      const isThenable = input.then && typeof input.then === 'function';
      return !!(isPromise || isThenable)
    } else {
      return false
    }
  }

  /**
   * Returns true if the input is an iterable (`Map`, `Set`, `Array`, Generator etc.).
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   * @example
   * > t.isIterable('string')
   * true
   * > t.isIterable(new Map())
   * true
   * > t.isIterable([])
   * true
   * > t.isIterable((function * () {})())
   * true
   * > t.isIterable(Promise.resolve())
   * false
   * > t.isIterable(Promise)
   * false
   * > t.isIterable(true)
   * false
   * > t.isIterable({})
   * false
   * > t.isIterable(0)
   * false
   * > t.isIterable(1.1)
   * false
   * > t.isIterable(NaN)
   * false
   * > t.isIterable(Infinity)
   * false
   * > t.isIterable(function () {})
   * false
   * > t.isIterable(Date)
   * false
   * > t.isIterable()
   * false
   * > t.isIterable({ then: function () {} })
   * false
   */
  function isIterable (input) {
    if (input === null || !isDefined(input)) {
      return false
    } else {
      return (
        typeof input[Symbol.iterator] === 'function' ||
        typeof input[Symbol.asyncIterator] === 'function'
      )
    }
  }

  /**
   * Returns true if the input value is a string. The equivalent of `typeof input === 'string'` for use in funcitonal contexts.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isString (input) {
    return typeof input === 'string'
  }

  /**
   * Returns true if the input value is a function. The equivalent of `typeof input === 'function'` for use in funcitonal contexts.
   * @param {*} - the input to test
   * @returns {boolean}
   * @static
   */
  function isFunction (input) {
    return typeof input === 'function'
  }

  var t = {
    isNumber,
    isPlainObject,
    isArrayLike,
    isObject,
    isDefined,
    isUndefined,
    isNull,
    isDefinedValue,
    isClass,
    isPrimitive,
    isPromise,
    isIterable,
    isString,
    isFunction
  };

  /**
   * Isomorphic map-reduce function to flatten an array into the supplied array.
   *
   * @module reduce-flatten
   * @example
   * const flatten = require('reduce-flatten')
   */

  /**
   * @alias module:reduce-flatten
   * @example
   * > numbers = [ 1, 2, [ 3, 4 ], 5 ]
   * > numbers.reduce(flatten, [])
   * [ 1, 2, 3, 4, 5 ]
   */
  function flatten (arr, curr) {
    if (Array.isArray(curr)) {
      arr.push(...curr);
    } else {
      arr.push(curr);
    }
    return arr
  }

  /**
   * @module wordwrapjs
   */

  const re = {
    chunk: /[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g,
    ansiEscapeSequence: /\u001b.*?m/g
  };

  /**
   * @alias module:wordwrapjs
   * @typicalname wordwrap
   */
  class WordWrap {
    constructor (text, options) {
      options = options || {};
      if (!t.isDefined(text)) text = '';

      this._lines = String(text).split(/\r\n|\n/g);
      this.options = options;
      this.options.width = options.width === undefined ? 30 : options.width;
      this.options.eol = options.eol || '\n';
    }

    lines () {
      /* trim each line of the supplied text */
      return this._lines.map(trimLine.bind(this))

        /* split each line into an array of chunks, else mark it empty */
        .map(line => line.match(re.chunk) || [ '~~empty~~' ])

        /* optionally, break each word on the line into pieces */
        .map(lineWords => {
          if (this.options.break) {
            return lineWords.map(breakWord.bind(this))
          } else {
            return lineWords
          }
        })
        .map(lineWords => lineWords.reduce(flatten, []))

        /* transforming the line of words to one or more new lines wrapped to size */
        .map(lineWords => {
          return lineWords
            .reduce((lines, word) => {
              let currentLine = lines[lines.length - 1];
              if (replaceAnsi(word).length + replaceAnsi(currentLine).length > this.options.width) {
                lines.push(word);
              } else {
                lines[lines.length - 1] += word;
              }
              return lines
            }, [ '' ])
        })
        .reduce(flatten, [])

        /* trim the wrapped lines */
        .map(trimLine.bind(this))

        /* filter out empty lines */
        .filter(line => line.trim())

        /* restore the user's original empty lines */
        .map(line => line.replace('~~empty~~', ''))
    }

    wrap () {
      return this.lines().join(this.options.eol)
    }

    toString () {
      return this.wrap()
    }

    /**
     * @param {string} - the input text to wrap
     * @param [options] {object} - optional configuration
     * @param [options.width] {number} - the max column width in characters (defaults to 30).
     * @param [options.break] {boolean} - if true, words exceeding the specified `width` will be forcefully broken
     * @param [options.noTrim] {boolean} - By default, each line output is trimmed. If `noTrim` is set, no line-trimming occurs - all whitespace from the input text is left in.
     * @param [options.eol] {boolean} - The end of line character to use. Defaults to `\n`.
     * @return {string}
     */
    static wrap (text, options) {
      const block = new this(text, options);
      return block.wrap()
    }

    /**
     * Wraps the input text, returning an array of strings (lines).
     * @param {string} - input text
     * @param {object} - Accepts same options as constructor.
     */
    static lines (text, options) {
      const block = new this(text, options);
      return block.lines()
    }

    /**
     * Returns true if the input text would be wrapped if passed into `.wrap()`.
     * @param {string} - input text
     * @return {boolean}
     */
    static isWrappable (text) {
      if (t.isDefined(text)) {
        text = String(text);
        var matches = text.match(re.chunk);
        return matches ? matches.length > 1 : false
      }
    }

    /**
     * Splits the input text into an array of words and whitespace.
     * @param {string} - input text
     * @returns {string[]}
     */
    static getChunks (text) {
      return text.match(re.chunk) || []
    }
  }

  function trimLine (line) {
    return this.options.noTrim ? line : line.trim()
  }

  function replaceAnsi (string) {
    return string.replace(re.ansiEscapeSequence, '')
  }

  /* break a word into several pieces */
  function breakWord (word) {
    if (replaceAnsi(word).length > this.options.width) {
      const letters = word.split('');
      let piece;
      const pieces = [];
      while ((piece = letters.splice(0, this.options.width)).length) {
        pieces.push(piece.join(''));
      }
      return pieces
    } else {
      return word
    }
  }

  return WordWrap;

})));
