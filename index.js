var x = require("xule"),
    g = x.logic,
    a = require("./microphone");

function r(min, max) {
    return Math.round(min + Math.random() * (max-min));
}

x.game(document.body, {
    //renderer
    //scene
    controller : function() {
        var ctrl = this;

        ctrl.camera = g.pos(g.euler({aspect : window.innerWidth / window.innerHeight, speed : .5 }));
    },
    fixedStep : function(ctrl) {
        console.log(a.analyze());
    },
    // stepLocal, stepRemote
    step : function(ctrl, delta) {
        var pos = g.pos({});

        if(x.key("W")) {
            pos.z -= ctrl.camera.speed;
        }
        if(x.key("A")) {
            pos.x -= ctrl.camera.speed;
        }
        if(x.key("S")) {
            pos.z += ctrl.camera.speed;
        }
        if(x.key("D")) {
            pos.x += ctrl.camera.speed;
        }

        pos.z && g.translateOnAxis(ctrl.camera, g.axisZ, pos.z);
        pos.x && g.translateOnAxis(ctrl.camera, g.axisX, pos.x);

        if(x.key("Q")) {
            ctrl.camera.ry += .01;
        }
        if(x.key("E")) {
            ctrl.camera.ry -= .01;
        }
    },
    render : function(ctrl) {
        // map changes from data back
        return x("object", [
            x("camera", ctrl.camera),
            x("light.point", {
                x : 5,
                y : 10
            }),
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
