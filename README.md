[![view on npm](http://img.shields.io/npm/v/wordwrapjs.svg)](https://www.npmjs.org/package/wordwrapjs)
[![npm module downloads per month](http://img.shields.io/npm/dm/wordwrapjs.svg)](https://www.npmjs.org/package/wordwrapjs)
[![Build Status](https://travis-ci.org/75lb/wordwrapjs.svg?branch=master)](https://travis-ci.org/75lb/wordwrapjs)
[![Dependency Status](https://david-dm.org/75lb/wordwrapjs.svg)](https://david-dm.org/75lb/wordwrapjs)

<a name="module_wordwrapjs"></a>
## wordwrapjs
Word wrapping, with a few features.

**Example**  
```js
> wrap = require("wordwrapjs")

> rap = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping."
> result = wrap(rap, { width: 20 })

> console.log(result);
I'm rapping. I'm
rapping. I'm rap rap
rapping. I'm rap rap
rap rap rappity
rapping.
```
<a name="exp_module_wordwrapjs--wrap"></a>
### wrap(text, [options]) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | the input text to wrap |
| [options] | <code>object</code> |  | optional config |
| [options.width] | <code>number</code> | <code>30</code> | the max line-width in characters |
| [options.ignore] | <code>RegExp</code> &#124; <code>Array.&lt;RegExp&gt;</code> |  | one or more patterns to be ignored when sizing the newly wrapped lines. For example `ignore: /\u001b.*?m/g` will ignore unprintable ansi escape sequences. |
| [options.newLine] | <code>string</code> | <code>&quot;\\n&quot;</code> | the desired new line character to use. |


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
