var bleno = require('bleno');

var SystemInformationService = require('./systeminformationservice');
var FilesystemService = require('./filesystemaccessservice');


var systemInformationService = new SystemInformationService();
var filesystemService = new FilesystemService();


bleno.on('accept', function(address){
  console.log("accepted: " + address);
});

bleno.on('disconnect', function(address){
  console.log("disconnected: " + address);
});


bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {

    bleno.startAdvertising("BLE: Alice DigitalLabs", [systemInformationService.uuid]);
  }
  else {

    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {

  console.log('on -> advertisingStart: ' +
    (error ? 'error ' + error : 'success')
  );

  if (!error) {

    bleno.setServices([
      systemInformationService,
      filesystemService
    ]);
  }
});
