'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');
var t = require('typical');

var re = {
  chunk: /[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g,
  ansiEscapeSequence: /\u001b.*?m/g
};

var TextBlock = function () {
  function TextBlock(text, options) {
    _classCallCheck(this, TextBlock);

    options = options || {};
    if (!t.isDefined(text)) text = '';
    this._lines = String(text).split(/\r\n|\n/g);
    this.width = options.width === undefined ? 30 : options.width;
    this.break = options.break;
  }

  _createClass(TextBlock, [{
    key: 'lines',
    value: function lines() {
      var _this = this;

      var flatten = require('reduce-flatten');
      return this._lines.map(trimLine).map(function (line) {
        return line.match(re.chunk) || ['~~empty~~'];
      }).map(function (lineWords) {
        if (_this.break) {
          return lineWords.map(function (word) {
            if (replaceIgnored(word, re.ansiEscapeSequence).length > _this.width) {
              var letters = word.split('');
              var section = void 0;
              var sections = [];
              while ((section = letters.splice(0, _this.width)).length) {
                sections.push(section.join(''));
              }
              return sections;
            } else {
              return word;
            }
          });
        } else {
          return lineWords;
        }
      }).map(function (lineWords) {
        return lineWords.reduce(flatten, []);
      }).map(function (lineWords) {
        return lineWords.reduce(function (lines, word) {
          var currentLine = lines[lines.length - 1];
          if (replaceIgnored(word, re.ansiEscapeSequence).length + currentLine.length > _this.width) {
            lines.push(word);
          } else {
            lines[lines.length - 1] += word;
          }
          return lines;
        }, ['']);
      }).reduce(flatten, []).map(trimLine).filter(function (line) {
        return line;
      }).map(function (line) {
        return line.replace('~~empty~~', '');
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.lines().join(os.EOL);
    }
  }], [{
    key: 'wrap',
    value: function wrap(text, options) {
      var block = new this(text, options);
      return block.toString();
    }
  }, {
    key: 'lines',
    value: function lines(text, options) {
      var block = new this(text, options);
      return block.lines();
    }
  }, {
    key: 'isWrappable',
    value: function isWrappable(text) {
      if (t.isDefined(text)) {
        text = String(text);
        var matches = text.match(re.chunk);
        return matches ? matches.length > 1 : false;
      }
    }
  }]);

  return TextBlock;
}();

function trimLine(line) {
  return line.trim();
}

function replaceIgnored(string, toReplace) {
  return string.replace(re.ansiEscapeSequence, '');
}

module.exports = TextBlock;