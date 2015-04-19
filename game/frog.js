var map = require("./map"),
    x = require("../../xule"),
    tones = require("./tones"),
    g = x.logic,
    frogs = [];

function findSpot() {
    var spot = map.data[g.r(0, map.data.length - 1)];

    return spot._type === "below" ? spot : findSpot();
}

function moveSpot(coord) {
    var x = 0, y = 0;
    switch(g.r(0, 3)) {
        case 0:
            x += 1;
            break;
        case 1:
            x -= 1;
            break;
        case 2:
            y += 1;
            break;
        default:
            y -= 1;
    }

    var spot = map.data[map.toIndex(coord.x + x, coord.y + y)];
    return spot._type === "below" ? spot : moveSpot(coord);
}

var frog = module.exports = {
    add : function(i) {
        var spot = findSpot();
        frogs.push({
            x : spot.x,
            z : spot.z,
            _type : "frog",
            material : {
                type : "lambert",
                color : 0x00FF00
            },
            geometry : {
                type : "box",
                width : 2,
                height: 2,
                depth : 2
            },
            ttm : g.r(500, 4000)
        });
        i--;
        i > 0 && frog.add(i);
    },
    controller : function(ctrl) {
        ctrl.frogs = frogs;
    },
    collide : function(stuff) {
        stuff.forEach(function(thing) {
            frogs.forEach(function(frog, fin) {
                if(frog.i === thing.i) {
                    frogs.splice(fin, 1);
                    tones.play("F#", 4);
                    thing.ttl = 0;
                }
            });
        });
    },
    step : function(ctrl, delta) {
        frogs.forEach(function(frog) {
            frog.ttm -= delta;
            if(frog.ttm <= 0) {
                frog.ttm = g.r(500, 4000);
                var spot = moveSpot(map.toCoord(frog.i));
                frog.x = spot.x;
                frog.z = spot.z;
            }
        });
        map.collide(frogs);
    },
    render : function(ctrl) {
        return frogs.map(function(frog) {
            return x("mesh", frog);
        });
    }
};
