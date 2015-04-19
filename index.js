var x = require("../xule"),
    g = x.logic,
    a = require("./game/microphone"),
    tones = require("./game/tones"),
    map = require("./game/map");

function makeBox(player) {
    // copy the position and rotation from cam
    var box = g.copy([ g.defs.vector, g.defs.euler ], {
        _type : "projectile",
        geometry : {
            type : "box",
            width : 1,
            height : 1,
            depth : 1
        },
        material : {
            type : "lambert",
            color: 0xFF0000
        },
        ttl : 4000
    }, player);

    // move it forward one!
    g.translateOnAxis(box, g.axisZ, -2);
    tones.play("c", 3);
    return box;
}

// wish I could pass operators like +=
function addAssign(prop, target, add) {
    target[prop] = target[prop] + add;
}

x.xule(document.body, {
    controller : function() {
        var ctrl = this;

        ctrl.map = map(require("./resources/mdata"));
        ctrl.boxes = [];

        ctrl.camera = g.quaternion({
            fov : 45,
            y : 80,
            x : 15 + 30,
            z : 15 + 30,
            aspect : window.innerWidth / window.innerHeight
        });

        ctrl.player = g.euler(g.pos({ speed : .5, x : 15, z: 15}));
        ctrl.spot = {
            y: 15,
            z : -2,
            tz : -5,
            ty : 0,
            castShadow : true
        };

        g.lookAt(ctrl.camera, ctrl.player);
        //g.lookAt(ctrl.spot, ctrl.player);

        ctrl.pos = g.pos();
        ctrl.controls = {
            W : g.fn(addAssign, "z", ctrl.pos, -ctrl.player.speed),
            A : g.fn(addAssign, "x", ctrl.pos, -ctrl.player.speed/2),
            S : g.fn(addAssign, "z", ctrl.pos, ctrl.player.speed),
            D : g.fn(addAssign, "x", ctrl.pos, ctrl.player.speed/2)
        };
    },
    fixedStep : function(ctrl) {
        if(a.analyse()) {
            ctrl.boxes.push(makeBox(ctrl.player));
        }
    },
    step : function(ctrl, delta) {
        // negate ctrl.pos
        var prev = g.copy(g.defs.vector, g.pos(), ctrl.player);
        ctrl.pos = g.copy(g.defs.vector, ctrl.pos, g.defs.vector);

        g.doKey(ctrl.controls);

        ctrl.pos.z && g.translateOnAxis(ctrl.player, g.axisZ, ctrl.pos.z);
        ctrl.pos.x && g.translateOnAxis(ctrl.player, g.axisX, ctrl.pos.x);


        // calc mouse pos compared to center
        ctrl.player.ry = Math.atan(g.mouse.y/g.mouse.x) + (g.mouse.x < 0 ? -180*Math.PI/180 : 0) - 40 *Math.PI/180;

        ctrl.boxes = ctrl.boxes.filter(function(box) {
            box.ttl -= delta;
            g.translateOnAxis(box, g.axisZ, -1.5);

            return box.ttl > 0;
        });

        if(map.collide(ctrl.player)) {
            ctrl.pos.z && g.translateOnAxis(ctrl.player, g.axisZ, -ctrl.pos.z * 2);
            ctrl.pos.x && g.translateOnAxis(ctrl.player, g.axisX, -ctrl.pos.x * 2);
        }
        // bind the camera x/z to the player.
        ctrl.camera.x += ctrl.player.x - prev.x;
        ctrl.camera.z += ctrl.player.z - prev.z;


        map.collide(ctrl.boxes);
    },
    render : function(ctrl) {
        // map changes from data back
        return x("object", [
            x("object", ctrl.player, [
                x("mesh", {
                    geometry : {
                        type : "box",
                        width : 2,
                        height : 5,
                        depth : 1
                    },
                    material : {
                        type : "lambert",
                        color : 0x0000FF
                    },
                    castShadow : true
                }),
                x("light.spot", ctrl.spot)
            ]),
            x("light.directional", {
                castShadow : true,
                shadowCameraNear : 1200,
                shadowCameraFar :2500,
                shadowCameraFov : 50,
                shadowBias : 0.0001,
                shadowDarkness : 0.5,
                shadowMapWidth : 2048,
                shadowMapHeight : 2048
            }),
            x("camera", ctrl.camera),
            x("object", map.render(ctrl.map)),
            x("object", ctrl.boxes.map(function(box) {
                return x("mesh", box);
            }))
        ]);
    }
});
