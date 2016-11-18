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

class TextBlock {
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

  toString () {
    return this.lines().join(os.EOL)
  }

  /**
   * @param {string} - the input text to wrap
   * @param [options] {object} - optional config
   * @param [options.width] {number} - the max column width in characters (defaults to 30).
   * @param [options.ignore] {RegExp | RegExp[]} - one or more patterns to be ignored when sizing the newly wrapped lines. For example `ignore: /\u001b.*?m/g` will ignore unprintable ansi escape sequences.
   * @param [options.break] {boolean} - if true, words exceeding the specified `width` will be forcefully broken
   * @param [options.eol] {string} - the desired new line character to use, defaults to [os.EOL](https://nodejs.org/api/os.html#os_os_eol).
   * @return {string}
   * @alias module:wordwrapjs
   */
  static wrap (text, options) {
    const block = new this(text, options)
    return block.toString()
  }
  static lines (text, options) {
    const block = new this(text, options)
    return block.lines()
  }
  /**
   * Returns true if the input text is wrappable
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
   * Splits the input text returning an array of words
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

// const lines = TextBlock.lines('one \n \n two three four', { width: 8 })
// console.log(lines)

module.exports = TextBlock
