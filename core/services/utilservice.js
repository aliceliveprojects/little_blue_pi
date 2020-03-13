var sprintf = require('sprintf-js').sprintf;

var CODES = {
    READY : -1,
    UNKNOWN_CODE: -2
}
var LAST_CODE = CODES.UNKNOWN_CODE;



function UtilService() {

    function createCommonReadOutput(){
        return {
            value : null
        }
    }
    
    function createOutput_statusCode(value){
        var result = createCommonReadOutput();
        if(!value || value > READY || value < LAST_CODE){
            value = CODES.UNKNOWN_CODE;
        }

        result.value = value;

        var output = new Buffer(JSON.stringify(result));

        return output;
    }

    function createOutput_Int(value){
        var output = new Buffer(sprintf("%d",value));
        return output;
    }

    function createReadOutput_String(value){
        var result = createCommonReadOutput();

        result.value = value;

        var output = new Buffer(JSON.stringify(result));

        return output;
    }


    function createReadOutput_Percent(value){
        var result = createCommonReadOutput();
        if(!value || value < 0){
            value = 0;
        }else{
            if(value > 100){
                value = 100;
            }
        }
        result.value = value;

        var output = new Buffer(JSON.stringify(result));

        return output;
    }

    function createDirListingOutput(path,listing){

        var result = {
            p: path,
            m: listing
        }

        var output = new Buffer(JSON.stringify(result));
        return output;
    }



    return {
        createDirListingOutput: createDirListingOutput,
        createReadOutput_Percent: createReadOutput_Percent,
        createReadOutput_String: createReadOutput_String,
        createOutput_Int: createOutput_Int
    }

};

module.exports = UtilService;