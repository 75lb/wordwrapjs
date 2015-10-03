'use strict'
var arrayify = require('array-back')
var os = require('os')

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
@param [options.eos=os.EOL] {string} - the desired new line character to use, defaults to [os.EOL](https://nodejs.org/api/os.html#os_os_eol).
@return {string}
@alias module:wordwrapjs
*/
function wrap (text, options) {
  options = options || {}
  options.width = options.width || 30
  options.eol = options.eol || os.EOL

  var lines = wrap.lines(text, options)
  return lines.join(options.eol)
}

/**
returns the wrapped output as an array of lines, rather than a single string
@return {Array}
*/
wrap.lines = function (text, options) {
  var words = text.split(/\s+/)
  var lineLength = 0
  var lines = []
  var line = ''

  words.forEach(function (word) {
    var wordLength = word.length

    if (options.ignore) {
      var wordWithoutIgnored = replaceIgnored(word, options.ignore)
      wordLength = wordWithoutIgnored.length
    }

    lineLength += wordLength

    if (lineLength > options.width) {
      lineLength = wordLength
      lines.push(line)
      line = word
    } else {
      line += (line ? ' ' : '') + word
      lineLength = replaceIgnored(line, options.ignore).length
    }
  })

  if (line) lines.push(line)

  return lines
}

function replaceIgnored (string, ignore) {
  ignore = arrayify(ignore)
  ignore.forEach(function (pattern) {
    string = string.replace(new RegExp(pattern, 'g'), '')
  })
  return string
}
