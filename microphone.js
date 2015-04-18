"use strict";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
    analyser = audioCtx.createAnalyser(),
    actions : {
        spike : function() {}
    },
    source,
    navigator.getUserMedia({ audio : true }, function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        anaylser.fftSize = 512;
    }),
    n = 0,
    mode = "silent";


function analyse() {
    var bufferLength = analyser.frequencyBinCount,
        dataArray = new Uint8Array(bufferLength);

    anaylser.getByteTimeDomainData(dataArray);

    for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        console.log(n, v);
    }
    n++;
}


var data = module.exports = {
    mode : mode,
    on : function(type, cb) {
        actions[type] = cb;
    },
    anaylse : anaylse
};
