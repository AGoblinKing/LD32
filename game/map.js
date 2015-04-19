"use strict";
var x = require("../../xule"),
    g = x.logic,
    size = 10,
    data = [],
    tones = require("./tones"),
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
                _type : "solid",
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
        },
        below : function(x, y) {
            return {
                _type : "below",
                castShadow : true,
                receiveShadow : true,
                x: x * size,
                z: y * size,
                y: -size,
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
    return parseInt([hex[g.r(0, 9)], hex[g.r(0, 9)], hex[g.r(0, 9)], hex[g.r(0, 9)], "FF"].join(""), 16);
}

function isHit(target) {
    var i = map.toIndex(Math.floor((target.x + size/2) / size  ), Math.floor((target.z + size/2)/ size)),
        hit = data[i];

    if(!hit) { return false; }

    if(hit._type === "solid" && target._type === "projectile") {
        tones.play("c#", 4);
        hit.material.color = randHex();
        target.ttl = 0;
    }
    if(!target._type && hit._type === "below" && target.i !== i) {
        hit.material.color = randHex();
        target.i = i;
        playRandom();
    }
    return hit._type === "solid";
}

function makeBlock(type, x, y) {
    switch(type) {
        case "X":
        case "x":
            return blocks.solid(x, y);
        default:
            return blocks.below(x, y);
    }
}

function playRandom() {
    tones.play(Object.keys(tones.map[0])[g.r(0, 16)], 1);
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

map.collide = function(targets) {
    if(!x.util.isArray(targets)) {
        targets = [ targets ];
    }

    return targets.reduce(function(hit, target) {
        return hit || isHit(target);
    }, false);
};

map.render = function(data) {
    // hue hue hue
    var render = data.filter(function(block) {
        return block;
    }).map(function(block) {
        return x("mesh", block);
    });

    return render;
};
