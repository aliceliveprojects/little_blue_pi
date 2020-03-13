var path = require('path');
var fs = require('fs');
var streamBuffers = require('stream-buffers');

function StreamService() {

    function createBuffStream(buffer, delay_ms, chunkSize_bytes) {

        var stream = null;
        stream = new streamBuffers.ReadableStreamBuffer(
            {
                frequency: delay_ms,      // in milliseconds.
                chunkSize: chunkSize_bytes     // in bytes.
            });
        stream.put(buffer);
        
        return stream;

    }

    function createFileStream(path) {
        var readStream = null;
        readStream = fs.createReadStream(path);
        return readStream;
    }





    return {
        createBuffStream: createBuffStream,
        createFileStrem: createFileStream
    }

};

module.exports = StreamService;