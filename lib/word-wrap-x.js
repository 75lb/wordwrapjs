"use strict";

/**
Word wrapping, with a few features. 

@module word-wrap-x
*/
module.exports = wrap;

/**
@param {string}
@param {object}
*/
function wrap(text, options){
    // if (!(this instanceof WordWrap)) return new WordWrap(text, options);

    var w = text.split(/\s+/);
    var width = 12;
    var total = 0;

    var result = w.reduce(function(prev, curr){
        total += curr.length + (prev ? 1 : 0);
    
        if (total > width) {
            total = curr.length;
            return prev + "\n" + curr;
        } else {
            if (prev) prev += " ";
            return prev + curr;
        }
    }, "");
    
    return result;    
}
