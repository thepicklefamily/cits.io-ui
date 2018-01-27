

// the below is all example code from a tutorial. to run tests on functions from different files, import
// them with module.exports and then require them here. here, for example, the module.exports.fToC function is being imported.


var {fToC, cToF} = require('./app.js');
var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return 0 for the first index', function() {
      assert.equal([1,2,3].indexOf(1), 0);
    });
  });
});


describe('Math', function() {
  describe('multiplication', function() {
    it('should return 9 when multiplying 3*3', function() {
      assert.equal(3*3, 9);
    });
    it('should return 8 when running (4-3)*8', function() {
      assert.equal((4-3)*8, 8);
    });
  });
});

describe('Temperature Conversion', function() {
  describe('cToF', function() {
    it('should convert -40 celsius to -40 fahrenheit', function() {
      assert.equal(-40, cToF(-40));
    });
    it('should convert 0 celsius to 32 fahrenheit', function() {
      assert.equal(32, cToF(0));
    });
    it('should return undefined if no temperature is input', function(){
      assert.equal(undefined, cToF(''));
    });
  });
  describe('fToC', function() {
    it('should convert -40 fahrenheit to -40 celsius', function() {
      assert.equal(-40, fToC(-40));
    });
    it('should convert 32 fahrenheit to 0 celsius', function() {
      assert.equal(0, fToC(32));
    });
    it('should return undefined if no temperature is input', function(){
      assert.equal(undefined, fToC(''));
    });
  });
});