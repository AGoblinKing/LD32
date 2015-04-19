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
                i : map.toIndex(x, y),
                geometry : cube,
                material : {
                    type : "lambert",
                    color : randHex("FFRRRR")
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
                i : map.toIndex(x, y),
                geometry : cube,
                material : {
                    type : "lambert",
                    color : randHex("FFRRRR")
                }
            };
        }
    },
    baseBlock;

function randHex(rand) {
    return parseInt(rand.split("").map(function(i) {
        return i === "R" ? hex[g.r(0, 9)] : i;
    }).join(""), 16);
}

function isHit(target) {
    var i = map.gToIndex(target.x, target.z),
        hit = data[i];


    if(!hit) { return false; }

    if(hit._type === "solid" && target._type === "projectile") {
        tones.play("c#", 4);
        hit.material.color = randHex("RRRRFF");
        target.ttl = 0;
    }
    if(target._type !== "projectile" && hit._type === "below" && target.i !== i) {
        switch(target._type) {
            case "frog":
                tones.play(g.ra(["f", "g", "e"]), 3);
                hit.material.color = randHex("RRFFRR");
                break;
            default:
                hit.material.color = randHex("RRRRFF");
                tones.play("c", 2);
        }

    }
    target.i = i;
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
    tones.play(Object.keys(tones.map[0])[g.r(0, 16)], 2);
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

map.data = data;

map.toCoord = function(i) {
    return {
        x : i % w,
        y : Math.floor(i / w)
    }
};

map.toIndex = function(x, y) {
    return (y * w) + x;
};

map.gToIndex = function(x, y){
    return map.toIndex(Math.floor((x + size/2) / size), Math.floor((y + size/2)/ size))
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
