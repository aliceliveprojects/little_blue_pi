var bleno = require('bleno');
var util = require('util');

var LoadAverageCharacteristic = require('./systemCharacteristics/loadaverage');
var UptimeCharacteristic = require('./systemCharacteristics/uptime');
var MemoryCharacteristic = require('./systemCharacteristics/memory');



function SystemInformationService() {

  bleno.PrimaryService.call(this, {
    uuid: '25576d0e-7452-4910-900b-1a9f82c19a7d',
    characteristics: [
      new LoadAverageCharacteristic(),
      new UptimeCharacteristic(),
      new MemoryCharacteristic()
    ]
  });
};

util.inherits(SystemInformationService, bleno.PrimaryService);
module.exports = SystemInformationService;
