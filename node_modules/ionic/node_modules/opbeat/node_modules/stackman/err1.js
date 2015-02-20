'use strict';

var stackman = require('./');

process.nextTick(function () {
  var err = new Error('foo');
  // console.log(err.stack);
  stackman()(err, function (stack) {
    var frame = stack.frames[0];
    console.log(frame.getTypeName());
  });
});
