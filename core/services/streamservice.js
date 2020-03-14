
var fs = require('fs');
var streamBuffers = require('stream-buffers');
var ReadableFileStream = require('./helpers/readable_filestream')


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

    function createFileStream(path, delay_ms, chunkSize_bytes) {
      
        var readStream = fs.createReadStream(path);
        var stream = new ReadableFileStream (
            {
                frequency: delay_ms,      // in milliseconds.
                chunkSize: chunkSize_bytes     // in bytes.
            });
        stream.put(readStream);

        return stream;

    }


    return {
        createBuffStream: createBuffStream,
        createFileStream: createFileStream
    }

};

module.exports = StreamService;