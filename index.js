import stringWidth from 'string-width'

/**
 * @module wordwrapjs
 */

/**
 * Wordwrap options.
 * @typedef {Object} WordwrapOptions
 * @property {number} [width=30] - The max column width in characters.
 * @property {boolean} [break=false] - If true, words exceeding the specified `width` will be forcefully broken
 * @property {boolean} [noTrim=false] - By default, each line output is trimmed. If `noTrim` is set, no line-trimming occurs - all whitespace from the input text is left in.
 * @property {string} [eol='\n'] - The end of line character to use. Defaults to `\n`.
 */

const re = {
  ansiEscapeSequence: /\u001b.*?m/g
}

/**
 * @alias module:wordwrapjs
 * @typicalname wordwrap
 */
class Wordwrap {
  /**
   * @param {string} text - The input text to wrap.
   * @param {module:wordwrapjs~WordwrapOptions} [options]
   */
  constructor (text = '', options = {}) {
    this._lines = String(text).split(/\r\n|\n/g)
    this.options = {
      eol: '\n',
      width: 30,
      ...options
    }
    this.segmenter = new Intl.Segmenter(this.options.locale, { granularity: 'word' })
  }

  lines () {
    /* trim each line of the supplied text */
    return this._lines.map(trimLine, this)

      /* split each line into an array of segments, else mark it empty */
      .map(line => {
        const segments = Array.from(this.segmenter.segment(line)).map(s => s.segment)
        if (segments.length) {
          return segments
        } else {
          return ['~~empty~~']
        }
      })

      /* optionally, break each word on the line into pieces */
      .map(segments => this.options.break
        ? segments.map(breakWord, this)
        : segments
      )
      .map(segments => segments.flat())

      /* transforming the line of segments to one or more new lines wrapped to size */
      .map(segments => {
        return segments
          .reduce((lines, word) => {
            const currentLine = lines[lines.length - 1]
            if (word.length + currentLine.length > this.options.width) {
            // if (stringWidth(word) + stringWidth(currentLine) > this.options.width) {
              lines.push(word)
            } else {
              lines[lines.length - 1] += word
            }
            return lines
          }, [''])
      })
      .flat()

      /* trim the wrapped lines */
      .map(trimLine, this)

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
   * @param {string} text - the input text to wrap
   * @param {module:wordwrapjs~WordwrapOptions} [options]
   */
  static wrap (text, options) {
    const block = new this(text, options)
    return block.wrap()
  }

  /**
   * Wraps the input text, returning an array of strings (lines).
   * @param {string} text - input text
   * @param {module:wordwrapjs~WordwrapOptions} [options]
   */
  static lines (text, options) {
    const block = new this(text, options)
    return block.lines()
  }

  /**
   * Returns true if the input text would be wrapped if passed into `.wrap()`.
   * @param {string} text - input text
   * @return {boolean}
   */
  static isWrappable (text = '') {
    const segments = this.getSegments(text)
    return segments ? segments.length > 1 : false
  }

  /**
   * Splits the input text into an array of words and whitespace.
   * @param {string} text - input text
   * @returns {string[]}
   */
  static getSegments (text) {
    return Array.from(this.segmenter.segment(text)).map(s => s.segment)
  }
}

function trimLine (line) {
  return this.options.noTrim ? line : line.trim()
}

function replaceAnsi (string) {
  return string.replace(re.ansiEscapeSequence, '')
}

/**
 * break a word into several pieces
 * @param {string} word
 * @private
 */
function breakWord (word) {
  if (stringWidth(word) > this.options.width) {
    const letters = word.split('')
    const letter = ''
    const pieces = []
    let piece = ''; let nextPiece = ''; let nextWidth = 0
    /* Performance sensitive loop - avoid new memory allocations (const, let) */
    while (letters.length) {
      nextPiece = piece + letters[0]
      nextWidth = stringWidth(nextPiece)
      if (nextWidth === this.options.width) {
        pieces.push(nextPiece)
        letters.shift()
        nextPiece = ''
        piece = ''
      } else if (nextWidth < this.options.width) {
        piece = nextPiece
        letters.shift()
        nextPiece = ''
      } else if (nextWidth > this.options.width && nextPiece.length === 1) {
        pieces.push(nextPiece)
        letters.shift()
        nextPiece = ''
        piece = ''
      } else if (nextWidth > this.options.width) {
        pieces.push(piece)
        nextPiece = ''
        piece = ''
      }
      if (letters.length === 0) {
        pieces.push(piece)
      }
    }
    return pieces
  } else {
    return word
  }
}

export default Wordwrap
