var bleno = require('bleno');
var os = require('os');
var util = require('util');

var BlenoCharacteristic = bleno.Characteristic;

var MemoryCharacteristic = function () {
  MemoryCharacteristic.super_.call(this, {
    uuid: 'fbfa8e9c-c1bd-4659-bbd7-df85c750fe6c',
    properties: ['read'],
  });
  // NOTE: for reads, value cannot be greater than 512 bytes long, and is sent in chunks the size of the MTU (max transmission unit).
  this._value = new Buffer(0);
};

MemoryCharacteristic.prototype.onReadRequest = function (offset, callback) {

  if (!offset) {

    this._value = new Buffer(JSON.stringify({
      'freeMemory': os.freemem(),
      'totalMemory': os.totalmem()
    }));
  }
  var data =  this._value.slice(offset, this._value.length);
  callback(this.RESULT_SUCCESS, data);
};

util.inherits(MemoryCharacteristic, BlenoCharacteristic);
module.exports = MemoryCharacteristic;
