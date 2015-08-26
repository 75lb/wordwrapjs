"use strict";

/**
Word wrapping, with a few features. 

@module wordwrapjs
*/
module.exports = wrap;

/**
@param {string}
@param {object}
*/
function wrap(text, options){
    // if (!(this instanceof WordWrap)) return new WordWrap(text, options);

    options = options || {};
    options.width = options.width || 30;
    
    var w = text.split(/\s+/);
    var total = 0;

    var result = w.reduce(function(prev, curr){
        total += curr.length + (prev ? 1 : 0);
    
            if (total > options.width) {
            total = curr.length;
            return prev + "\n" + curr;
        } else {
            if (prev) prev += " ";
            return prev + curr;
        }
    }, "");
    
    return result;    
}
