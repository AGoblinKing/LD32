"use strict";
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

var audioCtx = (new (window.AudioContext || window.webkitAudioContext)()),
    analyser = audioCtx.createAnalyser(),
    actions = {
        spike : function() {}
    },
    source,
    mode = "silent";

navigator.getUserMedia({ audio : true }, function(stream) {
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 512;
}, function(err) {
    console.log("you suck", err);
});

function analyse() {
    var bufferLength = analyser.frequencyBinCount,
        dataArray = new Uint8Array(bufferLength),
        pew = false;

    analyser.getByteTimeDomainData(dataArray);

    for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i]; // Seems like "quiet" is 128
        if(v > 150 || v < 90 ) {
            pew = true; // I think there was a pew
        }
    }

    return pew;
}


var data = module.exports = {
    mode : mode,
    on : function(type, cb) {
        actions[type] = cb;
    },
    analyse : analyse
};
