var path = require('path');
var fs = require('fs');
var streamify = require('stream-array');

function StreamService() {
    
    function createBuffStream(buffer){
        return new Promise(function(resolve, reject){
            var stream = null;
            try{
                stream = streamify(buffer);
                resolve(stream);
            }catch(e){
                reject(e);
            }
        });  
    }

    function createFileStream(path){
        return new Promise(function(resolve, reject){
            var readStream = null;
            
            try{
                readStream = fs.createReadStream(path);
                readStream.on('open', function () {
                    resolve(readStream);
                  });
                readStream.on('error', function(error){
                    reject(error);
                });

            }catch(e){
                reject(e);
            }
        });
    }

  



    return {
        createBuffStream: createBuffStream,
        createFileStrem: createFileStream
    }

};

module.exports = StreamService;