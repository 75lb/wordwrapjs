'use strict'
const os = require('os')
const t = require('typical')

/**
 * @module wordwrapjs
 */

const re = {
  chunk: /[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g,
  ansiEscapeSequence: /\u001b.*?m/g
}

/**
 * @alias module:wordwrapjs
 * @typicalname wordwrap
 */
class WordWrap {

  constructor (text, options) {
    options = options || {}
    if (!t.isDefined(text)) text = ''

    this._lines = String(text).split(/\r\n|\n/g)
    this.width = options.width === undefined ? 30 : options.width
    this.break = options.break
  }

  lines () {
    const flatten = require('reduce-flatten')
    return this._lines.map(trimLine)
      .map(line => line.match(re.chunk) || [ '~~empty~~' ])
      .map(lineWords => {
        if (this.break) {
          return lineWords.map(word => {
            if (replaceIgnored(word, re.ansiEscapeSequence).length > this.width) {
              const letters = word.split('')
              let section
              const sections = []
              while ((section = letters.splice(0, this.width)).length) {
                sections.push(section.join(''))
              }
              return sections
            } else {
              return word
            }
          })
        } else {
          return lineWords
        }
      })
      .map(lineWords => lineWords.reduce(flatten, []))
      .map(lineWords => {
        return lineWords
          .reduce((lines, word) => {
            let currentLine = lines[lines.length - 1]
            if (replaceIgnored(word, re.ansiEscapeSequence).length + currentLine.length > this.width) {
              lines.push(word)
            } else {
              lines[lines.length - 1] += word
            }
            return lines
          }, [ '' ])
      })
      .reduce(flatten, [])
      .map(trimLine)
      .filter(line => line)
      .map(line => line.replace('~~empty~~', ''))
  }

  wrap () {
    return this.lines().join(os.EOL)
  }

  toString () {
    return this.wrap()
  }

  /**
   * @param {string} - the input text to wrap
   * @param [options] {object} - optional configuration
   * @param [options.width] {number} - the max column width in characters (defaults to 30).
   * @param [options.break] {boolean} - if true, words exceeding the specified `width` will be forcefully broken
   * @return {string}
   */
  static wrap (text, options) {
    const block = new this(text, options)
    return block.wrap()
  }

  /**
   * Wraps the input text, returning an array of strings (lines).
   * @param {string} - input text
   * @param {object} - Accepts same options as constructor.
   */
  static lines (text, options) {
    const block = new this(text, options)
    return block.lines()
  }

  /**
   * Returns true if the input text would be wrapped if passed into `.wrap()`.
   * @param {string} - input text
   * @return {boolean}
   */
  static isWrappable (text) {
    if (t.isDefined(text)) {
      text = String(text)
      var matches = text.match(re.chunk)
      return matches ? matches.length > 1 : false
    }
  }

  /**
   * Splits the input text into an array of words.
   * @param {string} - input text
   * @returns {string[]}
   */
  static getWords (text) {
    return text.match(re.chunk) || []
  }

}

function trimLine (line) {
  return line.trim()
}

function replaceIgnored (string, toReplace) {
  return string.replace(re.ansiEscapeSequence, '')
}

module.exports = WordWrap
