"use strict";
var x = require("../../xule"),
    g = x.logic,
    size = 10,
    data = [],
    w, h,
    hex = "0123456789ABCDEF".split(""),
    cube = {
        type : "box",
        width : size,
        height : size,
        depth : size
    },
    blocks = {
        solid : function(x, y) {
            return {
                castShadow : true,
                receiveShadow : true,
                x: x * size,
                z: y * size,
                geometry : cube,
                material : {
                    type : "lambert",
                    color : randHex()
                }
            };
        }
    },
    baseBlock;

function randHex() {
    return Math.parseInt([hex[g.r(0, 5), hex[g.r(0, 5)], hex[g.r(0, 5)], hex[g.r(0, 5), "FF"].join(""), 16);
}

function makeBlock(type, x, y) {
    switch(type) {
        case "X":
        case "x":
            return blocks.solid(x, y);
    }
}

var map = module.exports = function(mData) {
    mData = mData.split("n");
    w = mData[0].length;
    h = mData.length;

    for(var y = 0; y < h; y++) {
        for(var x = 0; x < w; x++) {
            data[map.toIndex(x, y)] = makeBlock(mData[y][x], x, y);
        }
    }

    baseBlock = {
        receiveShadow : true,
        geometry : {
            type : "box",
            width : w * size,
            height : 1,
            depth : h * size
        },
        material : {
            type : "lambert",
            color : 0xFFFFFF
        },
        x :  Math.floor(w / 2) * size,
        z :  Math.floor(h / 2) * size,
        y :  -1
    };

    return data;
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

map.render = function(data) {
    // hue hue hue
    var render = data.filter(function(block) {
        return block;
    }).map(function(block) {
        return x("mesh", block);
    });

    render.unshift(x("mesh", baseBlock));

    return render;
};
