// RIP TECHNOBLADE NEVER FORGET o7

import * as THREE from '/src/html/modules/three.module.js';
import { GLTFLoader } from '/src/html/modules/GLTFLoader.js';
import { OrbitControls } from '/src/html/modules/OrbitControls.js';
import { GUI } from '/src/html/modules/dat.gui.module.js';
import * as functions from '/src/functions/functions.js';
let scene, camera, hlight, DataToSend, turtle, loader = new GLTFLoader(), Block = 1, NewBlock, removable_items = [], data;

var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var header = req.responseURL
header = header.substring(56)
var TurtleName = header

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x616164);
    
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.rotation.x = -0.3;

    hlight = new THREE.AmbientLight (0x404040, 6);
    scene.add(hlight);

    const geometry = new THREE.BoxGeometry  ( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {
        color: 0x00ff00,
        opacity: 0.3,
        transparent: true
    });

    window.addEventListener('resize', () => {
        const { innerWidth, innerHeight } = window;

        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
    });

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( -10, 10, 10 );
    controls.update();
    
    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
    };

    loader.load('/turtle.gltf', function(gltf) {
        turtle = gltf.scene.children[0];
        turtle.position.set(0, 0, 0);
        controls.target.set(0, 0, 0);
        scene.add(gltf.scene);
        animate(turtle);
    });

    let x = 0, y = 0, z = 0;
    let direction = 'south';

    var MovementButton1 = { Forward: async function() { 
        var data = await MakeArrayAndSend(x, y, z, "forward")
        console.log(data)
        if (data.boolean != false) {
            var coords = functions.forward(direction, x, z);
            x = coords[0], z = coords[1];
            SetPos(turtle,x,y,z)
            AddInspectedBlocks(data,x,y,z)
        }
        //console.log(scene.children[Block].position.z)
        //data = await receiveData()
        //NewBlock = addBlock(Block);
        //removable_items.push(NewBlock)
        //Block = Block + 1
        //console.log(Block)
    }};

    var MovementButton2 = { Left: async function() {
        var data = await MakeArrayAndSend(x, y, z, "left")
        if (data.boolean != false) {
            direction = functions.left(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(-90));
            AddInspectedBlocks(data,x,y,z)
        }
    }};

    var MovementButton3 = { Right: async function() {
        var data = await MakeArrayAndSend(x, y, z, "right")
        if (data.boolean != false) {
            direction = functions.right(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(90));
            AddInspectedBlocks(data,x,y,z)
        }
    }};

    var MovementButton4 = { clear:function() {
        //scene.remove(NewBlock)
        clean()
        //console.log(Block)
        //scene.remove()
    }};

    var MovementButton5 = { Up: async function() {
        y = ++y
        var data = await MakeArrayAndSend(x, y, z, "up")
        if (data.boolean != false) {
            SetPos(turtle,x,y,z)
            AddInspectedBlocks(data,x,y,z)
        }
    }};

    var MovementButton6 = { Down: async function() {
        y = --y
        var data = await MakeArrayAndSend(x, y, z, "down")
        if (data.boolean != false) {
            SetPos(turtle,x,y,z)
            AddInspectedBlocks(data,x,y,z)
        }
    }};
    
    var MovementButton7 = { Back: async function() {
        var data = await MakeArrayAndSend(x, y, z, "back")
        console.log(data)
        if (data.boolean != false) {
            var coords = functions.back(direction, x, z);
            x = coords[0], z = coords[1];
            SetPos(turtle,x,y,z)
            AddInspectedBlocks(data,x,y,z)
        }
    }}

    //var RefreshTurtles = { RefreshTurtles: async function() {
        //let array;
        //let respond = await sendData("give me turtles", '/utility')
        //for (var i in respond) {
            //let name = respond[i]
            //array = Names(name, i)
            //Turtles.add(array[i], name)
        //}
    //}}

    const gui = new GUI();
    const Movement = gui.addFolder('Movement');
        Movement.add(MovementButton1,'Forward');
        Movement.add(MovementButton2, 'Left');
        Movement.add(MovementButton3, 'Right');
        Movement.add(MovementButton4, 'clear');
        Movement.add(MovementButton5, 'Up');
        Movement.add(MovementButton6, "Down")
        Movement.add(MovementButton7, "Back")
    Movement.open();

    //const Turtles = Gui.addFolder('Turtles')
        //Turtles.add(RefreshTurtles, 'RefreshTurtles')
    //Turtles.open()

    async function MakeArrayAndSend(x, y, z, dir) {
        if (TurtleName != false) {
            DataToSend = MakeAnArray(dir, x, y, z, TurtleName)
            data = await sendData(DataToSend, '/pepe')
        } else {
            alert("Return to the turtles page and select one")
        }
        return data
    };

    function Names(name, i) {
        let array = []
        if (name == "Zeus") {
            array[i] = { Zeus: async function () {
                TurtleName = "Zeus"
            }}
            return array;
        } else if (name == "Hera") {
            array[i] = { Hera: async function () {
                TurtleName = "Hera"
            }}
        }
    };

    async function povorot(x, y, z, kyda) {
        if (kyda == "left") {
            direction = functions.left(direction);
            DataToSend = MakeAnArray("left",x,y,z,TurtleName)
            data = await sendData(DataToSend, '/pepe')
            turtle.rotateZ(THREE.MathUtils.degToRad(-90));
        } else if (kyda == "right"){
            DataToSend = MakeAnArray("right",x,y,z,TurtleName)
            data = await sendData(DataToSend, '/pepe')
            direction = functions.right(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(90));
        }
        AddInspectedBlocks(data)
        return data.message
    };

    function SetPos(target, x, y, z) {
        target.position.set(x, y, z);
        controls.target.set(x, y, z);
    };

    function MakeAnArray(moveDir, x, y, z, toWho) {
        DataToSend = {
            x: x,
            y: y,
            z: z,
            dir: moveDir,
            who: toWho
        }
        DataToSend = JSON.stringify(DataToSend)
        return DataToSend;
    };

    function addBlock(Block, where, direction,x,y,z) {
        Block = new THREE.Mesh( geometry, material );
        scene.add(Block);
        if (where == "up") {
            Block.position.set(x, y + 1, z);
        } else if (where == "middle") {
            var coords = functions.forward(direction, x, z)
            let nx = coords[0], nz = coords[1];
            Block.position.set(nx, y, nz)
        } else {
            Block.position.set(x, y - 1, z);
        }
        return Block
    };

    function AddInspectedBlocks(data,x,y,z) {
        if (data != null) {
            if (data.up != "Noblock") {
                addBlock(data.up, "up", direction,x,y,z)
            }
            if (data.down != "Noblock") {
                addBlock(data.down, "down", direction,x,y,z)
            }
            if (data.middle != "Noblock") {
                addBlock(data.middle, "middle", direction,x,y,z)
            }
            console.log(data.up, " | ", data.middle, " | ", data.down)     
        } else {
            console.log("message is empty")
        }
    }

    function clean() {
        if( removable_items.length > 0 ) {
          removable_items.forEach(function(v,i) {
             scene.remove(v);
          });
          removable_items = null;
          removable_items = [];
          Block = 1;
          SetPos(turtle, 0, 0, 0)
          x = 0, y = 0, z = 0
        }
    };

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
            do {
            currentDate = Date.now();
            } while (currentDate - date < milliseconds);
    };

    async function sendData(data, where, options = {}) {
        data = {message: data}

        const { timeout = 8000 } = options;
  
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            return await fetch(where, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json'
              },
              signal: controller.signal
            })
            .then((response)=>response.json())
              .then((responseJson)=>{clearTimeout(id); return responseJson});
        } catch (error) {
            console.error("Error: " + error)
        }
        clearTimeout(id);
    };

    var WASD = document.getElementById("WASD");
    WASD.addEventListener('keydown', async function(event) {
        const key = event.key.toLowerCase();

        if (key == 'w') {
            var coords = functions.forward(direction, x, z);
                let xx = coords[0], zz = coords[1];
            var data = await MakeArrayAndSend(xx, y, zz, "forward")
            if (data.boolean != false) {
                var coords = functions.forward(direction, x, z);
                x = coords[0], z = coords[1];
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
            }
        } else if (key == 'a') {;
            var data = await MakeArrayAndSend(x, y, z, "left")
            if (data.boolean != false) {
                direction = functions.left(direction);
                turtle.rotateZ(THREE.MathUtils.degToRad(-90));
                AddInspectedBlocks(data,x,y,z)
            }
        } else if (key == 'd') {;
            var data = await MakeArrayAndSend(x, y, z, "right")
            if (data.boolean != false) {
                direction = functions.right(direction);
                turtle.rotateZ(THREE.MathUtils.degToRad(90));
                AddInspectedBlocks(data,x,y,z)
            }
        } else if (key == 's') {
            var data = await MakeArrayAndSend(x, y, z, "back")
            console.log(data)
            if (data.boolean != false) {
                var coords = functions.back(direction, x, z);
                x = coords[0], z = coords[1];
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
                }
        } else if (key == 'q') {
            let Tosendy = y + 1
            var data = await MakeArrayAndSend(x, Tosendy, z, "up")
            if (data.boolean != false) {
                y = ++y
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
            }
        } else if (key == 'z') {
            let Tosendy = y - 1
            var data = await MakeArrayAndSend(x, Tosendy, z, "down")
            if (data.boolean != false) {
                y = --y
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
            }
        };

    });
};

export default init();