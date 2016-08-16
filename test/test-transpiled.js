require('babel-polyfill')

"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPromise = require("fs-promise");

var _fsPromise2 = _interopRequireDefault(_fsPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
  var text;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _fsPromise2.default.readFile('README.md', 'utf-8');

        case 2:
          text = _context.sent;


          console.log(text);

          // await console.log('hi')

          // function merp(){

          // }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}))();
