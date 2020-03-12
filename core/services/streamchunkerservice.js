require ('stream');

function StreamChunkerService() {

    function createChunkedReadable(readable, chunk_bytes, delay_ms) {
    
        let stream = new Stream;
        let _cancel = stream.cancel;
        let _stopped = false;
        stream.readable = true;
        stream.chunkCount = 0;
        
    
        function send() {
            var chunk = readable.read(chunk_bytes);
            
            if(!!chunk && chunk.size > 0 && !stopped){
                stream.emit('data', readable.read(size));
                stream.chunkCount++;
                if(!!delay_ms){
                    setTimeout(send, delay_ms);
                }
            }else{
                stream.emit(null);
                stream.emit('end');            
            }
        }

        function cancel(){
            stopped = true;  
            _cancel(); // call cancel on the original stream method
        }
    
        send();
    
        return stream;
    }


    return {
        createChunkedReadable: createChunkedReadable
    }

};

module.exports = StreamChunkerService;