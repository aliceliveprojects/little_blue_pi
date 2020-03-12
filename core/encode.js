
'use strict';

module.exports.stringToBytes = function(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
     }
     return array.buffer;
 }

 module.exports.bytesToString = function(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

