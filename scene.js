// RIP TECHNOBLADE NEVER FORGET o7

import { GLTFLoader } from '/src/html/modules/GLTFLoader.js';
import { OrbitControls } from '/src/html/modules/OrbitControls.js';
import { GUI } from '/src/html/modules/dat.gui.module.js';
import * as functions from '/src/functions/functions.js';
let scene, camera, hlight, DataToSend, turtle, loader = new GLTFLoader(), Block = 1, NewBlock, removable_items = [], data;

var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var header = req.responseURL;
header = header.substring(41);
console.log(header);
var TurtleName = header;

async function init() {

    let datochka = await sendData({message: "turtle direction and pos", name: TurtleName}, '/utility');
    let direction = datochka.message, x = datochka.x, y = datochka.y, z = datochka.z;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x616164);
    
    camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight,0.01,999999);
    camera.position.set(x + -3, y + 3, z + 3);
    camera.rotation.x = -0.3;

    hlight = new THREE.AmbientLight (0x404040, 6);
    scene.add(hlight);

    const geometry = new THREE.BoxGeometry  ( 1, 1, 1 );
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
    controls.update();
    
    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
    }

    loader.load('/turtle.gltf', function(gltf) {
        turtle = gltf.scene.children[0];
        turtle.position.set(x, y, z);
        controls.target.set(x, y, z);
        if (direction == "south") {
            turtle.rotateZ(THREE.MathUtils.degToRad(180));
        } else if (direction == "east") {
            turtle.rotateZ(THREE.MathUtils.degToRad(90));
        } else if (direction == "west") {
            turtle.rotateZ(THREE.MathUtils.degToRad(-90));
        }
        scene.add(gltf.scene);
        animate(turtle);
    });

    var MovementButton1 = { Forward: async function() {
        console.log(scene.children)
        let coords = functions.forward(direction, x, z);
                let xx = coords[0], zz = coords[1];
        var data = await MakeArrayAndSend(xx, y, zz, "forward", direction);
        if (data.boolean != false & data.whereToGo == "forward") {
            coords = functions.forward(direction, x, z);
            x = coords[0], z = coords[1];
            SetPos(turtle,x,y,z);
            AddInspectedBlocks(data,x,y,z);
        } else if (data.boolean == false) {
            AddInspectedBlocks(data,x,y,z);
        }
        //console.log(scene.children[Block].position.z)
        //data = await receiveData()
        //NewBlock = addBlock(Block);
        //removable_items.push(NewBlock)
        //Block = Block + 1
        //console.log(Block)
    }};

    var MovementButton2 = { Left: async function() {
        let Tempdirection = functions.left(direction);
        var data = await MakeArrayAndSend(x, y, z, "left", Tempdirection);
        if (data.boolean != false & data.whereToGo == "left") {
            direction = functions.left(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(-90));
            AddInspectedBlocks(data,x,y,z);
        }
    }};

    var MovementButton3 = { Right: async function() {
        let Tempdirection = functions.right(direction);
        var data = await MakeArrayAndSend(x, y, z, "right", Tempdirection);
        if (data.boolean != false & data.whereToGo == "right") {
            direction = functions.right(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(90));
            AddInspectedBlocks(data,x,y,z);
        }
    }};

    var MovementButton4 = { clear:function() {
        //scene.remove(NewBlock)
        //clean();
        //console.log(Block)
        //scene.remove()
        for (var i in scene.children) {
            console.log(scene.children[i].position.x, " ", scene.children[i].position.y, " || ", scene.children[i].position.z )
            scene.children[i].position.x
        }
    }};

    var MovementButton5 = { Up: async function() {
        let Tosendy = y + 1;
            var data = await MakeArrayAndSend(x, Tosendy, z, "up");
            if (data.boolean != false & data.whereToGo == "up") {
                y = ++y;
                SetPos(turtle,x,y,z);
                AddInspectedBlocks(data,x,y,z);
            } else if (data.boolean == false) {
                AddInspectedBlocks(data,x,y,z);
            }
    }};

    var MovementButton6 = { Down: async function() {
        let Tosendy = y - 1;
            var data = await MakeArrayAndSend(x, Tosendy, z, "down");
            if (data.boolean != false & data.whereToGo == "down") {
                y = --y;
                SetPos(turtle,x,y,z);
                AddInspectedBlocks(data,x,y,z);
            } else if (data.boolean == false) {
                AddInspectedBlocks(data,x,y,z);
            }
    }};
    
    var MovementButton7 = { Back: async function() {
        var coords = functions.back(direction, x, z);
                let xx = coords[0], zz = coords[1];
        var data = await MakeArrayAndSend(xx, y, zz, "back", direction)
        console.log(data);
        if (data.boolean != false & data.whereToGo == "back") {
            coords = functions.back(direction, x, z);
            x = coords[0], z = coords[1];
            SetPos(turtle,x,y,z);
            AddInspectedBlocks(data,x,y,z);
        } else if (data.boolean == false) {
            AddInspectedBlocks(data,x,y,z);
        }
    }};

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
    Movement.position
    Movement.open();

    //const Turtles = Gui.addFolder('Turtles')
        //Turtles.add(RefreshTurtles, 'RefreshTurtles')
    //Turtles.open()

    async function MakeArrayAndSend(x, y, z, dir, direction) {
        if (TurtleName != false) {
            DataToSend = MakeAnArray(dir, x, y, z, TurtleName, direction)
            data = await sendData(DataToSend, '/pepe')
        } else {
            alert("Return to the turtles page and select one")
        }
        return data
    }

    function SetPos(target, x, y, z) {
        target.position.set(x, y, z);
        controls.target.set(x, y, z);
    }

    function MakeAnArray(moveDir, x, y, z, toWho, dirr) {
        DataToSend = {
            x: x,
            y: y,
            z: z,
            dir: moveDir,
            who: toWho,
            direction: dirr
        }
        DataToSend = JSON.stringify(DataToSend)
        return DataToSend;
    }

    function addBlock(Blockk, where, direction,x,y,z, color) {
        console.log(color)
        let material = new THREE.MeshBasicMaterial( {
            color: parseInt(Number(color), 10),
            opacity: 0.5,
            transparent: true
        });
        let Block = new THREE.Mesh( geometry, material );
        scene.add(Block);
        if (where == "up") {
            let broke = false
            for (var i in scene.children) {
                if (scene.children[i].position.x == x & scene.children[i].position.y == y + 1 & scene.children[i].position.z == z) {
                    broke = true
                    break;
                }
            }
            if (broke == false) {
                Block.position.set(x, y + 1, z);
            }
        } else if (where == "middle") {
            var coords = functions.forward(direction, x, z)
            let nx = coords[0], nz = coords[1], broke = false;
            for (var i in scene.children) {
                if (scene.children[i].position.x == nx & scene.children[i].position.y == y & scene.children[i].position.z == nz) {
                    broke = true
                    break;
                }
            }
            if (broke == false) {
                Block.position.set(nx, y, nz);
            }
        } else {
            let broke = false
            for (var i in scene.children) {
                if (scene.children[i].position.x == x & scene.children[i].position.y == y - 1 & scene.children[i].position.z == z) {
                    broke = true
                    break;
                }
            }
            if (broke == false) {
                Block.position.set(x, y - 1, z);
            }
        }
        return Block
    }

    function AddInspectedBlocks(data,x,y,z) {
        let colorUp = "Nocolor", colorMiddle = "Nocolor", colorDown = "Nocolor"
        if (data.colorUp != undefined) {
            colorUp = data.colorUp
        }
        if (data.colorMiddle != undefined) {
            colorMiddle = data.colorMiddle
        }
        if (data.colorDown != undefined) {
            colorDown = data.colorDown
        }
        console.log(colorUp, " ", colorMiddle, " ", colorDown)
        if (data != null) {
            if (data.up != "Noblock") {
                addBlock(data.up, "up", direction,x,y,z, colorUp)
            }
            if (data.down != "Noblock") {
                addBlock(data.down, "down", direction,x,y,z, colorDown)
            }
            if (data.middle != "Noblock") {
                addBlock(data.middle, "middle", direction,x,y,z, colorMiddle)
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
    }

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
            do {
            currentDate = Date.now();
            } while (currentDate - date < milliseconds);
    }

    async function sendData(data, where, options = {}) {
        data = {message: data};

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
              .then((responseJson)=>{clearTimeout(id); console.log(responseJson); return responseJson;});
        } catch (error) {
            console.error("Error: " + error)
        }
        clearTimeout(id);
    }

    var WASD = document.getElementById("WASD");
    WASD.addEventListener('keydown', async function(event) {
        const key = event.key.toLowerCase();

        if (key == 'w') {
            let coords = functions.forward(direction, x, z);
                let xx = coords[0], zz = coords[1];
            var data = await MakeArrayAndSend(xx, y, zz, "forward", direction)
            console.log(data.whereToGo)
            if (data.boolean != false & data.whereToGo == "forward") {
                coords = functions.forward(direction, x, z);
                x = coords[0], z = coords[1];
                SetPos(turtle,x,y,z);
                AddInspectedBlocks(data,x,y,z);
            } else if (data.boolean == false) {
                AddInspectedBlocks(data,x,y,z);
            }
        } else if (key == 'a') {
            let Tempdirection = functions.left(direction);
            let data = await MakeArrayAndSend(x, y, z, "left", Tempdirection)
            if (data.boolean != false & data.whereToGo == "left") {
                direction = functions.left(direction);
                turtle.rotateZ(THREE.MathUtils.degToRad(-90));
                AddInspectedBlocks(data,x,y,z)
            }
        } else if (key == 'd') {
            let Tempdirection = functions.left(direction);
            let data = await MakeArrayAndSend(x, y, z, "right", Tempdirection)
            if (data.boolean != false & data.whereToGo == "right") {
                direction = functions.right(direction);
                turtle.rotateZ(THREE.MathUtils.degToRad(90));
                AddInspectedBlocks(data,x,y,z)
            }
        } else if (key == 's') {
            var coords = functions.forward(direction, x, z);
                let xx = coords[0], zz = coords[1];
            var data = await MakeArrayAndSend(xx, y, zz, "back", direction)
            if (data.boolean != false & data.whereToGo == "back") {
                var coords = functions.back(direction, x, z);
                x = coords[0], z = coords[1];
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
                } else if (data.boolean == false) {
                    AddInspectedBlocks(data,x,y,z);
                }
        } else if (key == 'q') {
            let Tosendy = y + 1
            var data = await MakeArrayAndSend(x, Tosendy, z, "up")
            if (data.boolean != false & data.whereToGo == "up") {
                y = ++y
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
            } else if (data.boolean == false) {
                AddInspectedBlocks(data,x,y,z);
            }
        } else if (key == 'z') {
            let Tosendy = y - 1
            var data = await MakeArrayAndSend(x, Tosendy, z, "down")
            if (data.boolean != false & data.whereToGo == "down") {
                y = --y
                SetPos(turtle,x,y,z)
                AddInspectedBlocks(data,x,y,z)
            } else if (data.boolean == false) {
                AddInspectedBlocks(data,x,y,z);
            }
        };

    });
};

export default init();
