"use strict";
var arrayify = require("array-back");

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
module.exports = wrap;

/**
@param {string} - the input text to wrap
@param [options] {object} - optional config
@param [options.width=30] {number} - the max column width in characters
@param [options.ignore] {RegExp | RegExp[]} - one or more patterns to be ignored when sizing the newly wrapped lines. For example `ignore: /\u001b.*?m/g` will ignore unprintable ansi escape sequences.
@param [options.newLine=os.EOL] {string} - the desired new line character to use, defaults to [os.EOL](https://nodejs.org/api/os.html#os_os_eol).
@return {string}
@alias module:wordwrapjs
*/
function wrap(text, options){
    options = options || {};
    options.width = options.width || 30;
    options.newLine = options.newLine || "\n";
    
    var words = text.split(/\s+/);
    var total = 0;

    return words.reduce(function(prev, curr){
        var currLength = curr.length;
        
        if (options.ignore){
            var ignore = arrayify(options.ignore);
            var withoutIgnored = curr;
            ignore.forEach(function(pattern){
                withoutIgnored = withoutIgnored.replace(pattern, "");
            });
            currLength = withoutIgnored.length;
        }

        total += currLength + (prev ? 1 : 0);
    
        if (total > options.width) {
            total = currLength;
            if (prev) prev += options.newLine;
            return prev + curr;
        } else {
            if (prev) prev += " ";
            return prev + curr;
        }
    }, "");
}
