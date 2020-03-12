var bleno = require('bleno');
var os = require('os');
var util = require('util');

var BlenoCharacteristic = bleno.Characteristic;

var UptimeCharacteristic = function () {

  UptimeCharacteristic.super_.call(this, {
    uuid: '4541e38d-7a4c-48a5-b7c8-61a0c1efddd9',
    properties: ['read'],
  });
  // NOTE: for reads, value cannot be greater than 512 bytes long, and is sent in chunks the size of the MTU (max transmission unit).
  this._value = new Buffer(0);
};

UptimeCharacteristic.prototype.onReadRequest = function (offset, callback) {

  if (!offset) {

    this._value = new Buffer(JSON.stringify({
      'uptime': os.uptime()
    }));
  }


  var data =  this._value.slice(offset, this._value.length);
  callback(this.RESULT_SUCCESS, data);
};

util.inherits(UptimeCharacteristic, BlenoCharacteristic);
module.exports = UptimeCharacteristic;
