'use strict'
var arrayify = require('array-back')
var os = require('os')
var t = require('typical')

/**
Word wrapping, with a few features. Namely the capability to ignore certain text patterns when wrapping (e.g. to prevent ansi escape sequences breaking layout in the terminal.)

@module wordwrapjs
@example
Wrap some sick bars in a 20 character column.

```js
> wrap = require("wordwrapjs")

> bars = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping."
> result = wrap(bars, { width: 20 })
```

`result` now looks like this:
```
I'm rapping. I'm
rapping. I'm rap rap
rapping. I'm rap rap
rap rap rappity
rapping.
```
*/
module.exports = wrap

/**
@param {string} - the input text to wrap
@param [options] {object} - optional config
@param [options.width=30] {number} - the max column width in characters
@param [options.ignore] {RegExp | RegExp[]} - one or more patterns to be ignored when sizing the newly wrapped lines. For example `ignore: /\u001b.*?m/g` will ignore unprintable ansi escape sequences.
@param [options.eol=os.EOL] {string} - the desired new line character to use, defaults to [os.EOL](https://nodejs.org/api/os.html#os_os_eol).
@return {string}
@alias module:wordwrapjs
*/
function wrap (text, options) {
  options = defaultOptions(options)
  text = validateInput(text)

  var lines = wrap.lines(text, options)
  return lines.join(options.eol)
}

/**
returns the wrapped output as an array of lines, rather than a single string
@param {string} - the input text to wrap
@param [options] {object} - same options as {@link module:wordwrapjs|wrap}
@return {Array}
@example
> bars = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping."
> wrap.lines(bars)
[ "I'm rapping. I'm rapping. I'm",
  "rap rap rapping. I'm rap rap",
  "rap rap rappity rapping." ]
*/
wrap.lines = function (text, options) {
  options = defaultOptions(options)
  text = validateInput(text)

  var words = text.split(/\s+/)

  if (words.length === 1){
    if (options.width < text.length) return [ text ]
  }

  var lineLength = 0
  var lines = []
  var line = ''

  words.forEach(function (word) {
    var wordLength = options.ignore
      ? replaceIgnored(word, options.ignore).length
      : word.length

    lineLength += wordLength + (line ? 1 : 0)

    if (lineLength > options.width) {
      /* Can't fit word on line, cache line and create new one */
      lines.push(line)
      line = word
      lineLength = wordLength
    } else {
      line += (line ? ' ' : '') + word
    }
  })

  if (line) lines.push(line)

  return lines
}

function replaceIgnored (string, ignore) {
  arrayify(ignore).forEach(function (pattern) {
    string = string.replace(pattern, '')
  })
  return string
}

function defaultOptions (options) {
  options = options || {}
  options.width = options.width || 30
  options.eol = options.eol || os.EOL
  return options
}

function validateInput(input){
  if (t.isString(input)){
    return input
  } else if (!t.isDefined(input)) {
    return ''
  } else {
    return String(input)
  }
}
