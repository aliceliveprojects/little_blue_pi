var bleno = require('bleno');
var util = require('util');
var utilService = require('../core/services/utilservice')();
var encode = require('../core/encode');
var filesystemService = require('../core/services/filesystemservice')();
var streamService = require('../core/services/streamservice')();



const states = {
    no_current_operation: -1,
    transferring: 0
}

const delay_ms = 5; // delay between sending chunks of a buffer.
var _transferPercent = 0;
var _chunkable = null;

// https://github.com/don/rfduino-logreader

var BlenoCharacteristic = bleno.Characteristic;

var state = states.no_current_operation;

var SetFileCharacteristic = function () {

    SetFileCharacteristic.super_.call(this, {
        uuid: 'c0e34e18-5bc5-4a44-a1a0-dd12a592339b',
        properties: ['write', 'read', 'notify']
    });

    // NOTE: for reads, value cannot be greater than 512 bytes long, and is sent in chunks the size of the MTU (max transmission unit).
    this._value = new Buffer(0);
};

// long write requests are supported on RaspberryPi 3 B, running Raspbian Buster
// tested sending 126 bytes. No problems.
SetFileCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    console.log('SetFileCharacteristic');
    var result = this.RESULT_UNLIKELY_ERROR;
    if (!offset) {

        try {
            var paramAsText = encode.bytesToString(data);
            var value = JSON.parse(paramAsText).value;
            console.log('SetFileCharacteristic - onWriteRequest: value = ' + paramAsText);
            filesystemService.setFile(value);

            result = this.RESULT_SUCCESS;

        } catch (error) {
            console.log("SetFileCharacteristic - error: " + JSON.stringify(error));
        }

    }

    callback(result);
};


SetFileCharacteristic.prototype.onReadRequest = function (offset, callback) {

    if (!offset) {
        var path = filesystemService.getFile();
        var result = utilService.createReadOutput_String(path);
        this._value = result;
    }
    var data = this._value.slice(offset, this._value.length);
    callback(this.RESULT_SUCCESS, data);
};


SetFileCharacteristic.prototype.onSubscribe = function (maxValueSize_bytes, updateValueCallback) {
    console.log('subscribing');

    if (state == states.no_current_operation) {
        state = states.transferring;

        var path = filesystemService.getPath();

        if (!!path) {

            // obviously, make sure nobody mods the file while we are uploading it, right?
            var fileSize = filesystemService.getFileSize();

            if (fileSize > 0) {
                // prepare to split the buffer into n chunks 
                // send as n + 1 notifications
                // first notifcation tells the client there will be n further notifications.

                var numChunks = Math.ceil(fileSize / maxValueSize_bytes);
                var _chunkable = streamService.createFileStream(path, delay_ms, maxValueSize_bytes);

                // wait to start sending actual data
                setTimeout(function () {
                    
                    _chunkable.on("end", function () {
                        state = states.no_current_operation;
                    });
                    // chunkable stream will start sending data as soon as on('data'... is called
                    _chunkable.on("data", function (chunk) {

                        _transferPercent = 100 * numChunks / _chunkable.chunkCount
                        updateValueCallback(chunk);
                    });

                }, delay_ms);

                // send the number of chunks to follow immediately, as the first notification.
                updateValueCallback(utilService.createOutput_Int(numChunks));
            }
        }
    }
}


SetFileCharacteristic.prototype.onUnsubscribe = function () {
    console.log('un-subscribing');
    if (state == states.transferring) {
        if (_chunkable) {
            _chunkable.stop();
            _chunkable = null;
        }
        state = states.no_current_operation;
    }

}





util.inherits(SetFileCharacteristic, BlenoCharacteristic);
module.exports = SetFileCharacteristic;
