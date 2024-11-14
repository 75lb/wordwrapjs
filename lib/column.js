import os from 'node:os'
import stringWidth from 'string-width'

class Column {
  lines = []
  #currentLine = ''
  #currentLineLength = 0
  options = {
    width: 30,
    widthMode: 'char',
    pad: false
  }

  constructor (options = {}) {
    Object.assign(this.options, options)
  }

  add (segment) {
    if (['\n', '\r\n', '\r'].includes(segment)) {
      this.end()
      return
    }

    const segmentLength = this.options.widthMode === 'char' ? segment.length : stringWidth(segment)
    if (this.#currentLineLength + segmentLength <= this.options.width) {
      this.#currentLine += segment
      this.#currentLineLength += segmentLength
    } else {
      if (this.#currentLine !== ' ') {
        this.end()
      }
      this.#currentLine = segment
      this.#currentLineLength = segmentLength
    }
  }

  end () {
    let c = this.#currentLine.trim()
    if (this.options.pad) {
      c = c.padEnd(this.options.width - (stringWidth(c) - c.length))
    }
    this.lines.push(c)
    this.#currentLine = ''
    this.#currentLineLength = 0
  }

  toString () {
    return this.lines.join(os.EOL)
  }
}

export default Column
