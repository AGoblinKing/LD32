var x = require("xule"),
    g = x.logic,
    a = require("./microphone");

function r(min, max) {
    return Math.round(min + Math.random() * (max-min));
}

function makeBox(cam) {
    // copy the position and rotation from cam
    var box = g.copy([ g.defs.vector, g.defs.euler ], {
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
        ttl : 2000
    }, cam);
    console.log(box);

    // move it forward one!
    g.translateOnAxis(box, g.axisZ, 1);
    return box;
}

x.game(document.body, {
    controller : function() {
        var ctrl = this;

        ctrl.camera = g.pos(g.euler({aspect : window.innerWidth / window.innerHeight, speed : .5 }));
        ctrl.boxes = [];

        ctrl.pos = g.pos();
        ctrl.controls = {
            W : g.fn(g.add, ctrl.pos.z, -ctrl.camera.speed),
            A : g.fn(g.add, ctrl.pos.x, -ctrl.camera.speed),
            S : g.fn(g.add, ctrl.pos.z, ctrl.camera.speed),
            D : g.fn(g.add, ctrl.pos.x, ctrl.camera.speed)
        };
    },
    fixedStep : function(ctrl) {
        if(a.analyse()) {
            ctrl.boxes.push(makeBox(ctrl.camera));
        }
    },
    step : function(ctrl, delta) {
        // negate ctrl.pos
        ctrl.pos = g.copy(g.defs.vector, ctrl.pos, g.defs.vector);
        g.doKey(ctrl.controls);

        pos.z && g.translateOnAxis(ctrl.camera, g.axisZ, ctrl.pos.z);
        pos.x && g.translateOnAxis(ctrl.camera, g.axisX, ctrl.pos.x);

        ctrl.boxes = ctrl.boxes.filter(function(box) {
            box.ttl -= delta;
            g.translateOnAxis(box, g.axisZ, 1);

            return box.ttl;
        });
    },
    render : function(ctrl) {
        // map changes from data back
        return x("object", [
            x("camera", ctrl.camera),
            x("light.point", {
                x : 5,
                y : 10
            }),
            x("object", ctrl.boxes.map(function(box) {
                return x("mesh", box);
            })),
            x("mesh", {
                y: 10,
                geometry : {
                    type : "box",
                    width : 100,
                    height : 50,
                    depth : 100
                },
                material : {
                    type : "lambert",
                    color: 0x0000FF,
                    side : 1
                }
            })
        ]);
    }
});
