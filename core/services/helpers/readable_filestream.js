'use strict';

// hacked together from 
// https://github.com/samcday/node-stream-buffer
// Thank you :-)

var stream = require('stream');
var util = require('util');


var constants = {
  DEFAULT_FREQUENCY: 1,
  DEFAULT_CHUNK_SIZE: 1024
};


var ReadableFileStream = module.exports = function(opts) {
  var that = this;
  opts = opts || {};

  stream.Readable.call(this, opts);

  this.stopped = false;

  var frequency = opts.hasOwnProperty('frequency') ? opts.frequency : constants.DEFAULT_FREQUENCY;
  var chunkSize = opts.chunkSize || constants.DEFAULT_CHUNK_SIZE;


  var source = null;
  var allowPush = false;

  var sendData = function() {
    
    var sendMore = false;

    var chunk=source.read(chunkSize);

    if (!!chunk && !that.stopped){
      sendMore = that.push(chunk) !== false;
      allowPush = sendMore;
    }else{
      that.push(null);
    }

    if (sendMore) {
      sendData.timeout = setTimeout(sendData, frequency);
    }
    else {
      sendData.timeout = null;
    }
  };

  this.stop = function() {
    if (this.stopped) {
      throw new Error('stop() called on already stopped ReadableStreamBuffer');
    }
    this.stopped = true;

  };


  var kickSendDataTask = function () {
    if (!sendData.timeout && allowPush) {
      sendData.timeout = setTimeout(sendData, frequency);
    }
  }

  this.put = function(readStream) {
    if (that.stopped) {
      throw new Error('Tried to connect a stopped stream');
    }
    source = readStream;
    source.on('readable', function(){
      kickSendDataTask();
    });
 
  };

  this._read = function() {
    setTimeout(function(){
      allowPush = true;
      kickSendDataTask();
    });

  };
};

util.inherits(ReadableFileStream, stream.Readable);
