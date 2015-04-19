"use strict";
var x = require("xule"),
    g = xule.logic,
    size = 10,
    w, h,
    cube = {
        type : "box",
        width : size,
        height : size,
        depth : size
    },
    blocks = {
        solid : function(x, y) {
            return {
                x: x * size,
                y: y * size,
                geometry : cube,
                material : {
                    type : "lambert",
                    color : 0x00FF00
                }
            };
        }
    };

function makeBlock(x, y) {
    if(x === 0 || y === 0 || x === w -1 || y === h - 1) {
        return blocks.solid(x, y);
    }
}

var map = module.exports = function(width, height) {
    w = width;
    h = height;

    var data = [];

    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            data[map.toIndex(x, y)] = makeBlock(x, y);
        }
    }
}

map.toCoord = function(i) {
    return {
        x : i % w,
        y : Math.floor(i / w)
    }
};

map.toIndex = function(x, y) {
    return (y * w) + x;
};

map.render = function(map) {
    // hue hue hue
    return map.map(function(block) {
        return m("mesh", block);
    });
};
