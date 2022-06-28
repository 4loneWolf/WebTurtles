import * as THREE from '/src/html/modules/three.module.js';
import {GLTFLoader} from '/src/html/modules/GLTFLoader.js';
import { OrbitControls } from '/src/html/modules/OrbitControls.js';
import { GUI } from '/src/html/modules/dat.gui.module.js';
import * as functions from '/src/functions/functions.js';

let scene, camera, hlight, responsee;

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

    function addBlock(Block) {
        Block = new THREE.Mesh( geometry, material );
        scene.add(Block);
        Block.position.set(x, y + 1, z);
        return Block
    };

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

    let turtle;
    let loader = new GLTFLoader();
    loader.load('/turtle.gltf', function(gltf) {
        turtle = gltf.scene.children[0];
        turtle.position.set(0, 0, 0);
        controls.target.set(0, 0, 0);
        scene.add(gltf.scene);
        animate(turtle);
    });

    let x = 0, y = 0, z = 0;
    let direction = 'south';

    var button3 = { Right:function() {
        direction = functions.right(direction);
        turtle.rotateZ(THREE.MathUtils.degToRad(90));
        sendData("right")
    }};

    var button2 = { Left:function() {
        direction = functions.left(direction);
        turtle.rotateZ(THREE.MathUtils.degToRad(-90));
        sendData("left")
    }};

    var button5 = { Up: async function() {
            y = ++y
            SetPos(turtle,x,y,z)
            sendData("up")
            sleep(10)
            data = await receiveData()
            console.log(data.message)
    }}

    let Block = 1, NewBlock, removable_items = [];

    function SetPos(target, x, y, z) {
        target.position.set(x, y, z);
        controls.target.set(x, y, z);
    }
    let data;
    var button1 = { Forward: async function() { 
        var coords = functions.forward(direction, x, z);
        x = coords[0], z = coords[1];
        
        data = await sendData("forward")
        //console.log(scene.children[Block].position.z)
        //data = await receiveData()
        if (data != null) {
            console.log(data.message)
            SetPos(turtle, x, y, z)
        } else {
            console.log("message is empty")
        }
        //NewBlock = addBlock(Block);
        //removable_items.push(NewBlock)
        //Block = Block + 1
        //console.log(Block)
    }};

    var button4 = { clear:function() {
        //scene.remove(NewBlock)
        clean()
        //console.log(Block)
        //scene.remove()
    }};

    const gui = new GUI();
    const Gui = new GUI()
    const Movement = gui.addFolder('Movement');
        Movement.add(button1,'Forward');
        Movement.add(button2, 'Left');
        Movement.add(button3, 'Right');
        Movement.add(button4, 'clear');
        Movement.add(button5, 'Up');
    Movement.open();

    const Turtles = Gui.addFolder('Turtles')

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

    window.addEventListener('resize', () => {
        const { innerWidth, innerHeight } = window;

        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
    });

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
            do {
            currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

    let TurtleNum = "1 ";

    function sendDATA(data) {
        let xhr = new XMLHttpRequest();

        let json = JSON.stringify({
           message: TurtleNum + data
        });

        xhr.open('POST', '/pepe', true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.send(json);
        xhr.response;
    };

    async function sendData(data) {
        data = {message: TurtleNum + data}
        try {
            return await fetch('/pepe', {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response)=>response.json())
              .then((responseJson)=>{return responseJson})
        } catch (error) {
            console.error("Error: " + error)
        }
    };

    var WASD = document.getElementById("WASD");
    WASD.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();

        if (key == 'w') {
            var coords = functions.forward(direction, x, z);
            x = coords[0], z = coords[1];
            SetPos(turtle,x,y,z)
            sendData("forward")
        } else if (key == 'a') {
            direction = functions.left(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(-90));
            sendData("left")
        } else if (key == 'd') {
            direction = functions.right(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(90));
            sendData("right")
        } else if (key == 's') {
            var coords = functions.back(direction, x, z);
            x = coords[0], z = coords[1];
            SetPos(turtle,x,y,z)
            sendData("back")
        } else if (key == 'q') {
            y = ++y
            SetPos(turtle,x,y,z)
            sendData("up")
        } else if (key == 'z') {
            y = --y
            SetPos(turtle,x,y,z)
            sendData("down")
        };

    });
};

export default init();