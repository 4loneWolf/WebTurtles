import * as THREE from '/src/html/modules/three.module.js';
import {GLTFLoader} from '/src/html/modules/GLTFLoader.js';
import { OrbitControls } from '/src/html/modules/OrbitControls.js';
import { GUI } from '/src/html/modules/dat.gui.module.js';
import * as Movements from '/src/functions/functionsMovement.js';

let scene, camera, hlight;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x616164);
    
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.rotation.x = -0.3;

    hlight = new THREE.AmbientLight (0x404040, 6);
    scene.add(hlight);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {
        color: 0x00ff00,
        opacity: 0.3,
        transparent: true
    });

    function addBlock(BlockName) {
        BlockName = new THREE.Mesh( geometry, material );
        scene.add(BlockName);
        BlockName.position.set(x, y + 1, z);
    };

    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( 0, 20, 100 );
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
        direction = Movements.right(direction);
        turtle.rotateZ(THREE.MathUtils.degToRad(90));
    }};

    var button2 = { Left:function() {
        direction = Movements.left(direction);
        turtle.rotateZ(THREE.MathUtils.degToRad(-90));
    }};

    let Block = "aboba";

    var button1 = { Forward:function() { 
        var coords = Movements.forward(direction, x, z);
        x = coords[0], z = coords[1];
        turtle.position.set(x, y, z);
        controls.target.set(x, y, z);
        Block = Block + "k";
        addBlock(Block);
        console.log(Block);
    }};

    const gui = new GUI();
    const Movement = gui.addFolder('Movement');
    Movement.add(button1,'Forward');
    Movement.add(button2, 'Left');
    Movement.add(button3, 'Right')
    Movement.open();

    var WASD = document.getElementById("WASD");
    WASD.addEventListener('keydown', async function(event) {
        const key = event.key.toLowerCase();
        console.log(key);
        if (key == 'w') {
            var coords = Movements.forward(direction, x, z);
            x = coords[0], z = coords[1];
            turtle.position.set(x, y, z);
            controls.target.set(x, y, z);
        } else if (key == 'a') {
            direction = Movements.left(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(-90));
        } else if (key == 'd') {
            direction = Movements.right(direction);
            turtle.rotateZ(THREE.MathUtils.degToRad(90));
        } else if (key == 's') {
            var coords = Movements.back(direction, x, z);
            x = coords[0], z = coords[1];
            turtle.position.set(x, y, z);
            controls.target.set(x, y, z);
        };
    });
};

export default init();